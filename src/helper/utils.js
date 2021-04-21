
export function getHashValues(hash) {
  return Object.values(hash) // needs modern browser
}

export function hashById(array) {
  let hash = {}

  for (let item of array) {
    hash[item.id] = item
  }

  return hash
}

export function excludeById(array, id) {
  return array.filter((item) => item.id !== id)
}

export function getTodayStr() {
  return new Date().toISOString().replace(/T.*$/, '')
}

export function getHead(type) {
  return type.name.includes('Read') ? 'Chapter' : 'Video'

}


export function getTimeFromMins(workHours) {
  let mins = workHours % 60;

  return mins
}

export function getTimeFromHours(workHours) {
  let hours = Math.floor(workHours / 60)
  return hours
}

export function strTohtml (str) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(str, 'text/html');
	return doc.body.firstChild.lastChild;
};