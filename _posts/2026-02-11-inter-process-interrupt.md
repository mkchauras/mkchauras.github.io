---
layout: post
title: Inter Process Interrupt
date: 2026-02-11 08:41 +0530
image: ipi/ipi-header.png
tags: [smt, processor, kernel, ipi, interrupt]
ready: true
---

# What is an IPI

An ipi is an special interrupt sent by one processor to another when it wants something to be done on that cpu. In ppc64le pseries with power10 this is treated as an external interrupt with xive as an interrupt controller.

Examples of such cases are
- flush mmu when memory mappings are changed
- wake up another cpu for scheduling reasons
- NMI for other proccesors
- Executing a specific function on that cpu

# How a powerpc processor causes an ipi in linux kernel

One of the function call made to invoke ipi's are smp_call_function_single(I am taking this as just an example here, there are other ways to trigger an ipi). This takes a function pointer and executes the function pointer on the target cpu. Lets take an example of this and walk through what happen when we cause an ipi.

```C
smp_call_function_single() -> // This will initialize call_single_data_t(csd) with parameters
    generic_exec_single(target_cpu, csd) -> // If the src and dest cpu are same execute the function then and there.
        __smp_call_single_queue(cpu, csd_node) -> // Add the csd to the queue
            arch_send_call_function_single_ipi(target_cpu)
```

From here onwards the call goes to arch specific handling.

```C
send_call_function_single_ipi(int cpu) ->
    arch_send_call_function_single_ipi -> // This call goes to arch specific handling
        // From here on we will consider ppc64le pseries machine
        do_message_pass(int cpu, int message) -> // Message being PPC_MSG_CALL_FUNCTION
            smp_muxed_ipi_message_pass(int cpu, int msg) -> // Store the messag
                smp_ops->cause_ipi() -> // This is set to xive_cause_ipi for pseries and powernv
                    xive_cause_ipi -> Write 0 to xive_cpu->ipi_data->trig_mmio
```
This is now written to per_cpu data for the target cpu. Writing to trig_mmio invokes xive and causes an ipi for the target cpu. Most of this is done by the hardware called xive, which is one of the interrupt controller for powerpc.

Now we have a better understanding of how a cpu can cause an ipi in linux. Let's look into the how after ipi is raised it's being handled.

# How a powerpc processor handles an ipi in linux kernel

The target cpu receives an external interrupt from xive and passes control to the external interrupt handler at 0x500(Refer The Power Instruction Set Architecture (ISA) Book III Chapter 7 Section 5). The processor does the necessary preparations to pass the control to interrupt handler safely, and then invokes the ipi handler of xive.

`arch/powerpc/kernel/smp.c` is the file exporting all the ways to send ipi's and implementing the ipi handler function.

`smp_ipi_demux` is the function which handles the ipi. This is called by xive_muxed_ipi_action in our case. xive registers this as an irq handler during the early boot in `xive_request_ipi`

So after all the arch common handling for external interrupt, we get a call to xive_muxed_ipi_action.
Below is the call chain after we get control to xive_muxed_ipi_action

```C
xive_muxed_ipi_action() ->
    smp_ipi_demux() ->
        smp_ipi_demux_relaxed() ->
        // Depending on the type of ipi it invokes the necessary handler
        // Here we'll take `PPC_MSG_CALL_FUNCTION` as an example
            generic_smp_call_function_interrupt() ->
                __flush_smp_call_function_queue(true) -> // This will execute all pending smp-call-function

```

This concludes how an ipi is handled in linux on ppc64le pseries with xive as their interrupt controller. IPI can be used for lot's of interesting purposes, but as any great thing this also has it's disadvantages, that means a lot's of ipi can cause performance to drop.
