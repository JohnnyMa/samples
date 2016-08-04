export default class Series {
  constructor(name, data = [], active = true) {
    this.name = name;
    this.data = data;
    this.active = active;
  }
}