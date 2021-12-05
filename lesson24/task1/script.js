const studentsData = [
  { name: 'Tom', birthDate: '01/05/2010' },
  { name: 'Ben', birthDate: '01/17/2008' },
  { name: 'Sam', birthDate: '03/15/2010' },
  { name: 'Alex', birthDate: '02/25/2011' },
  { name: 'Nik', birthDate: '02/12/2009' },
  { name: 'Mike', birthDate: '02/13/2009' },
  { name: 'Bob', birthDate: '02/01/2010' },
  { name: 'Ann', birthDate: '05/12/2010' },
];

const studentsBirthDays = (students) => {
  const monthsArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const filteredArray = [...students]
    .sort((a, b) => new Date(a.birthDate).getDate() - new Date(b.birthDate).getDate())
    .map(({ name, birthDate }) => [monthsArray[new Date(birthDate).getMonth()], name]);
  //   [  { name: 'Tom', birthDate: '01/05/2010' }, { name: 'Ben', birthDate: '01/17/2008' }]  =>  [['Jan', 'Ben'], ['Jan', 'Tom'] ]

  const obj = {};

  for (let i = 0; i < filteredArray.length; i++) {
    if (!obj.hasOwnProperty(filteredArray[i][0])) {
      obj[filteredArray[i][0]] = [filteredArray[i][1]];
    } else {
      obj[filteredArray[i][0]].push(filteredArray[i][1]);
    }
  }

  return obj;
  // [['Jan', 'Ben'], ['Jan', 'Tom'] ]  => Jan: ['Ben', 'Tom'] , Mar: ['Sam']
};

console.log(studentsBirthDays(studentsData));

//   [  { name: 'Tom', birthDate: '01/05/2010' }, { name: 'Ben', birthDate: '01/17/2008' }]  =>  [['Jan', 'Ben'], ['Jan', 'Tom'] ]
