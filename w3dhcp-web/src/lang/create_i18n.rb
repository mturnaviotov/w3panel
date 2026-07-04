require 'csv'
require 'json'

languages = {}
src = CSV.open('lang.csv', headers: :first_row, :col_sep => ";").map(&:to_h)
headers = File.readlines("lang.csv")[0].strip!.split(';')
langs = headers[1..]
langs.each {|l| languages[l] = {}}
src.each do |row|
    langs.each {|l| languages[l][row['key']] = row[l]  }
end
langs.map {|l| File.open(l+'.json','w') { |file| file.write languages[l].to_json }}
