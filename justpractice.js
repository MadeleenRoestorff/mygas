class HashTable {
  constructor() {
    this.values = {};
    this.length = 0;
    this.size = 3;
  }

  calculateHash(key) {
    return key.toString().length % this.size;
  }

  add(key, value) {
    const hash = this.calculateHash(key);
    if (!this.values.hasOwnProperty(hash)) {
      this.values[hash] = {};
    }
    if (!this.values[hash].hasOwnProperty(key)) {
      this.length++;
    }
    this.values[hash][key] = value;
  }

  search(key) {
    const hash = this.calculateHash(key);
    if (
      this.values.hasOwnProperty(hash) &&
      this.values[hash].hasOwnProperty(key)
    ) {
      return this.values[hash][key];
    } else {
      return null;
    }
  }
}

//create object of type hash table
const ht = new HashTable();
//add data to the hash table ht
ht.add('Canada', '300');
ht.add('Canada', '900');
ht.add('Germany', '100');
ht.add('Italy', '50');
ht.add('Martin', '111');
ht.add('Madeleen', '121');
ht.add('Belfasts', '101');

function Rectangle(a, b) {
  this.length = a;
  this.width = b;

  this.perimeter = a + b;
  this.area = a * b;
}

const rec = new Rectangle(4, 5);

console.log(rec.length);
console.log(rec.width);
console.log(rec.perimeter);
console.log(rec.area);

console.log('index file');

import { Company } from './company';
import { CompanyDataSource } from './company-data-source';

const companyList = CompanyDataSource.getCompanyList();

console.log(companyList);

for (let i = 0; i < companyList.length; i++) {
  console.log(companyList[i]);
  const company = companyList[i];
  console.log(company.region);
  if (company.region[0] == 'E') {
    company.region = 'England';
  }
}

console.log(companyList);

numbers.sort((a, b) => {
  if (a.companyName < b.companyName) {
    return -1;
  }
  return 1;
});
