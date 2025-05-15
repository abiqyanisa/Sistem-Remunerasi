import bcrypt from 'bcrypt';

export async function up(queryInterface, Sequelize) {
  const hashedPassword1 = await bcrypt.hash('admin123', 10);
  const hashedPassword2 = await bcrypt.hash('dekan123', 10);
  const hashedPassword3 = await bcrypt.hash('kaprodi123', 10);
  const hashedPassword4 = await bcrypt.hash('dosen123', 10);

  return queryInterface.bulkInsert('User', [
    {
      nidn: '1111111111',
      password: hashedPassword1,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nidn: '0014048102',
      password: hashedPassword2,
      role: 'dekan',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nidn: '0011066803',
      password: hashedPassword3,
      role: 'kaprodi',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      nidn: '0030119006',
      password: hashedPassword4,
      role: 'dosen',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete('User', {
    nidn: ['1111111111', '0011066803', '0014048102', '0030119006']
  }, {});
}