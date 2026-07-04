import moment from 'moment'

export const sortDate = (a, b) => {
  const date1 = moment(a.date_expire)
  const date2 = moment(b.date_expire)
  if(date1.isBefore(date2)) return -1
  if(date1.isAfter(date2)) return 1
  return 0
} 

export const shortDate = (data) => {
  const date = moment(data)
  return date.format('DD MMM YY')
}

