module Normalize

require 'addressable'

  def domain_to_ascii(src)
    src.downcase!
    if src =~ /http\:\/\//
      Addressable::URI.parse(src).normalized_host
    else
      Addressable::URI.parse("http://#{src}").normalized_host
    end
  end

  def domain_from_ascii(src)
    src.downcase!
    if src =~ /http\:\/\//
      Addressable::URI.parse(src).display_uri.host
    else
      Addressable::URI.parse("http://#{src}").display_uri.host
    end
  end

end
