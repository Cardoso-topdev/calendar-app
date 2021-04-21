export const dateToString = (date) => {
  return date.toISOString().replace(/T.*$/, '');
}

export const addDays = (date, addedDays) => {
  let newDate = new Date(date.getTime())
  return new Date(newDate.setDate(newDate.getDate() + addedDays));
}

