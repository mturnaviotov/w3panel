# frozen_string_literal: true

require 'logger'
require 'date'

require_relative "mepp/version"
require "mepp/version.rb"
require "mepp/connection.rb"
require "mepp/common.rb"
require "mepp/domain.rb"
require "mepp/host.rb"
require "mepp/contact.rb"
require "mepp/helpers.rb"
require "mepp/poll.rb"
require "mepp/utils.rb"

module Mepp
  class Client

  include Mepp::Connection
  include Mepp::Common
  include Mepp::Domain
  include Mepp::Host
  include Mepp::Contact
  include Mepp::Poll
  include Mepp::Helpers
  include Mepp::Utils

    attr_reader :provider, :options
    def initialize(provider, options = {loglevel: 0, logpath: '/opt/w3dhcp/log/mepp', testing: false})
      @provider = provider
			@options  = options
      @cltrid   = "#{@provider[:login]}-" << DateTime.now.to_s
      @client.options[:loglevel] = 5 unless @options[:loglevel]
      @logger ||= Logger.new("#{options[:logpath]}/#{@provider[:login]}_#{@cltrid}.log" || STDOUT)
      @testing = options[:testing]   
    end

    def options
      @options
    end

    def options=(key, value)
      @options[key.to_hash] = value
    end
  end

  class Error < StandardError; end

end
