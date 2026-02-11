# mkchauras.in

Personal website and blog by Mukesh Kumar Chaurasiya.

## Theme Attribution

This website is built using the [Millennial Jekyll theme](https://github.com/LeNPaul/Millennial) by Paul Le, licensed under the MIT License.

## Local Development

Post under work are inside the folder work-in-progress.

To serve on local end:

```bash
bundle config set path 'vendor/bundle'
bundle install && bundle exec jekyll serve
```

To test for production:

```bash
JEKYLL_ENV=production bundle exec jekyll serve
```

To add a new post

```bash
bundle exec jekyll post "<Post Title>"
```

Thankyou

