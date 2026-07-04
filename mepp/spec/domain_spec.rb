require 'spec_helper'

operator = {:host=>"www.ukrnames.com", :port=>"700", :password=>"2oolXE3v"}

c = Mepp::Client.new(operator)
c.options[:testing] = true

RSpec.describe Mepp do
  it 'Domain available check' do
    expect(c.domain_check('true.com')[:avail]).to eq '1'
    expect(c.domain_check('true.com')[:reason]).to eq ''
  end

  it 'Domain not available check' do
    expect(c.domain_check('false.com')[:avail]).to eq '0'
  end

  it 'Domain not available info' do
    expect(c.domain_info('false.com')[:code]).to eq '2303'
  end

  it 'Domain existant info' do
    expect(c.domain_info('test.com')).to include(:name, :dates, :ids, :hostobject,
      :contacts, :status)
  end

#  it 'does something useful' do
#    expect(false).to eq(true)
#  end
end
