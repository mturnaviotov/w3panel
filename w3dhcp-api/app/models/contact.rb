class Contact < ApplicationRecord
  belongs_to :customer

  def whois
		I18n.locale = :ua
    c = {}
    c[:name_ascii] = I18n.transliterate(name)
    c[:organization_ascii] = I18n.transliterate(name)
    c[:address_ascii] = I18n.transliterate(address)
    c[:city_ascii] = I18n.transliterate(city)
    c[:region_ascii] = I18n.transliterate(sp)
    c[:zipcode] = zipcode
    c[:country] = cc

    c[:name_idn] = name
    c[:organization_idn] = name
    c[:address_idn] = address
    c[:city_idn] = city
    c[:region_idn] = sp
    c[:voice] = voice
    c[:email] = email
    c[:pw] = SecureRandom.hex(16)
#    c[:private] = private ? 0 : 1
    c
  end

end
