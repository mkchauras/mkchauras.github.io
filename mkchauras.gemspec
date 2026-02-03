# frozen_string_literal: true

# This gemspec is kept for dependency management only.
# Original theme: Millennial by Paul Le (https://github.com/LeNPaul/Millennial)
# This site: mkchauras.in by Mukesh Kumar Chaurasiya

Gem::Specification.new do |spec|
  spec.name          = "mkchauras"
  spec.version       = "1.0.0"
  spec.authors       = ["Mukesh Kumar Chaurasiya"]
  spec.email         = ["mkchauras@gmail.com"]

  spec.summary       = "Personal website and blog - based on Millennial theme"
  spec.homepage      = "https://mkchauras.in"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|LICENSE|README|CHANGELOG)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.2"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.6"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.3"
  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.6"
  spec.add_runtime_dependency "jekyll-compose"

end
