# frozen_string_literal: true

require_relative "lib/mepp/version"

Gem::Specification.new do |spec|
  spec.name          = "mepp"
  spec.version       = Mepp::VERSION
  spec.authors       = ["Mykola Turnaviotov"]
  spec.email         = ["turnaviotovnn@gmail.com"]

  spec.summary       = "Simple EPP lib"
  spec.description   = "Simple EPP lib"
  spec.homepage      = "https://localhost.com"
  spec.license       = "MIT"
  spec.required_ruby_version = ">= 4.0"

  spec.metadata["allowed_push_host"] = "https://localhost.com"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://localhost.com"
  spec.metadata["changelog_uri"] = "https://localhost.com"

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{\A(?:test|spec|features)/}) }
  end
  spec.bindir        = "exe"
  spec.executables   = spec.files.grep(%r{\Aexe/}) { |f| File.basename(f) }
  spec.require_paths = ["lib"]

  # Uncomment to register a new dependency of your gem
  # spec.add_dependency "example-gem", "~> 1.0"

  spec.add_dependency 'nokogiri'

  # For more information and examples about making a new gem, checkout our
  # guide at: https://bundler.io/guides/creating_gem.html
end
