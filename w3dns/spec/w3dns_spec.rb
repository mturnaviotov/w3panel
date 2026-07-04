# frozen_string_literal: true

require "spec_helper"

RSpec.describe W3dns do
  it "has a version number" do
    expect(W3dns::VERSION).not_to be nil
  end

  describe "W3dns::Server" do
    before do
      W3dns::Server.configure('localhost', 'secret_key', 8081)
    end

    it "configures and fetches a zone" do
      zone_data = {
        name: 'example.com.',
        account: 'test_account',
        dnssec: false,
        id: 'example.com.',
        kind: 'Native',
        rrsets: [
          {name: 'example.com.', type: 'SOA', records: [{content: 'ns1.example.com. hostmaster.example.com. 1 2 3 4 5'}]}
        ]
      }

      allow(W3dns::Gw).to receive(:request).with("zones/example.com.", "").and_return({code: '200', body: zone_data})

      zone = W3dns::Server.zone.get('example.com.')
      expect(zone.name).to eq('example.com.')
      expect(zone.kind).to eq('Native')
    end

    it "sends correct patch request to update a DNS record" do
      zone_data = {
        name: 'example.com.',
        account: 'test_account',
        dnssec: false,
        id: 'example.com.',
        kind: 'Native',
        rrsets: [
          {name: 'example.com.', type: 'SOA', records: [{content: 'ns1.example.com. hostmaster.example.com. 1 2 3 4 5'}]}
        ]
      }

      # 1. Fetch zone
      allow(W3dns::Gw).to receive(:request).with("zones/example.com.", "").and_return({code: '200', body: zone_data})
      zone = W3dns::Server.zone.get('example.com.')

      # 2. Mock the patch update request and the post-update get request
      expected_rrset = {
        rrsets: [
          {
            name: 'www.example.com.',
            type: 'A',
            changetype: 'REPLACE',
            records: [{content: '1.2.3.4', disabled: false}],
            ttl: 3600,
            comments: []
          }
        ]
      }

      expect(W3dns::Gw).to receive(:request).with('zones/example.com.', expected_rrset, 'patch').and_return({code: '204', body: 'Data saved'})
      expect(W3dns::Gw).to receive(:request).with("zones/example.com.", "").and_return({code: '200', body: zone_data})

      zone.update_record('www.example.com.', 'A', ['1.2.3.4'])
    end
  end
end
