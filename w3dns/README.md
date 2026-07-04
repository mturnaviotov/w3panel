# W3dns

Welcome to your new gem! In this directory, you'll find the files you need to be able to package up your Ruby library into a gem. Put your Ruby code in the file `lib/w3pdns`. To experiment with that code, run `bin/console` for an interactive prompt.

TODO: Delete this and the text above, and describe your gem

## Build and install to %path% libs on current host

```
git clone ...
cd w3dns
gem build
rake install
```

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'w3dns'
```

And then execute:

    $ bundle install

Or install it yourself as:

    $ gem install w3dns

## Usage

```
c = W3pdns::W3dns.new('localhost', '8081', 'somecoolpassword from web api')
c.zone.create({name: 'example.com.',masters:['ns1.example.com.','ns2.example.com.'],nameservers:['ns1.example.com.','ns2.example.com.'],account: 'test',kind:'Master'})
c.zone.new('example.com.').update_record('example.com.','wwwqqqw.example.com.','A', ['10.10.10.10','20.20.20.20'])
c.zone.new('wxample.com.').delete_record('example.com.','wwwqqqw.example.com.','A')
c.zone.delete('example.com.')
```
TODO: Write usage instructions here

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake spec` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and the created tag, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/[USERNAME]/w3pdns. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/[USERNAME]/w3pdns/blob/master/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the W3pdns project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/[USERNAME]/w3pdns/blob/master/CODE_OF_CONDUCT.md).
