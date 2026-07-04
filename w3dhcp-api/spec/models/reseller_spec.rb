require 'rails_helper'

RSpec.describe Reseller, type: :model do

  it "Check creating first reseller" do
    Reseller.create(is_owner: true)
    expect(Reseller.count).to eq 1
  end

  it "Check creating second owner reseller" do
    expect(Reseller.create(is_owner: true)).to_not be_valid
    expect(Reseller.count).to eq 1
  end

  it "Check creating second reseller" do
    expect(Reseller.create).to be_valid
    expect(Reseller.count).to eq 2
  end

end
