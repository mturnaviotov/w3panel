# frozen_string_literal: true

require_relative "lib/w3dns/version"

Gem::Specification.new do |spec|
  spec.name          = "w3dns"
  spec.version       = W3dns::VERSION
  spec.authors       = ["Mykola Turnaviotov"]
  spec.email         = ["turnaviotovnn@gmail.com"]

  spec.summary       = "PowerDNS api caller."
#  spec.description   = "TODO: Write a longer description or delete this line."
#  spec.homepage      = "TODO: Put your gem's website or public repo URL here."
  spec.license       = "MIT"
  spec.required_ruby_version = ">= 4.0"

#  spec.metadata["allowed_push_host"] = "TODO: Set to 'https://mygemserver.com'"

  spec.metadata["homepage_uri"] = 'http://localhost.com'
#  spec.metadata["source_code_uri"] = "TODO: Put your gem's public repo URL here."
#  spec.metadata["changelog_uri"] = "TODO: Put your gem's CHANGELOG.md URL here."

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

  spec.add_development_dependency "pry"

  # For more information and examples about making a new gem, checkout our
  # guide at: https://bundler.io/guides/creating_gem.html
end
