
---
layout: post
title: Debugging Linux Kernel With GDB
date: 2026-02-12 08:41 +0530
image: ipi/ipi-header.png
tags: [kernel, linux, gdb, debug]
ready: false
---

## How to debug via gdb

We will use ppc64le pseries with power10 processor for the rest of the series.

Prepare to debug via gdb:

- Using this [rootfs](https://github.com/groeck/linux-build-test/blob/master/rootfs/ppc64/rootfs-el.cpio.gz).

- Compiling the linux kernel with ppc64le_defconfig and enable debugging symbols. I am using an x86 machine and debugging for ppc64le.
- Using the following command to invoke the qemu, `-s` will start the gdb server on port 1234 and `-S` will wait till a gdb client is attached.
```bash
qemu-system-ppc64 -nographic -vga none \
    -M pseries -smp 2 -m 4G -accel tcg \
    -kernel ./vmlinux \
    -netdev user,id=net0 -device e1000e,netdev=net0 \
    -initrd  ~/src/build-containers/ppc64le/ppc64le-rootfs.cpio.gz \
    -append "noreboot" \
    -cpu power10 \
    -s -S
```

Connect the gdb to it 
