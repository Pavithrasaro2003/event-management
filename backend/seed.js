require('dotenv').config({ path: './.env' });
const { sequelize } = require('./config/db');
const Event = require('./modules/event/event.model');
const User = require('./modules/admin/admin.model');

const seedEvents = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected.');

    // Find any organizer or user to assign events to
    let user = await User.findOne({ where: { role: 'organizer' } });
    if (!user) {
      user = await User.findOne();
    }
    if (!user) {
      console.log('No users found. Creating a dummy organizer...');
      user = await User.create({ name: 'Admin Organizer', email: 'admin@eventpro.com', password: 'password', role: 'organizer' });
    }

    const sampleEvents = [
      {
        title: "Yuvan Shankar Raja Live Concert",
        venue: "Chennai Trade Centre",
        date: "2026-07-15",
        price: 999,
      },
      {
        title: "Anirudh Ravichander Live Concert",
        venue: "Nehru Stadium",
        date: "2026-07-22",
        price: 1499,
      },
      {
        title: "HipHop Tamizha Live Concert",
        venue: "Coimbatore Codissia",
        date: "2026-08-05",
        price: 799,
      },
      {
        title: "A.R. Rahman Musical Night",
        venue: "YMCA Grounds",
        date: "2026-08-12",
        price: 1999,
      },
      {
        title: "Vijay Antony Live Show",
        venue: "Madurai",
        date: "2026-08-20",
        price: 699,
      },
      {
        title: "Comedy Night Live",
        venue: "Music Academy",
        date: "2026-08-25",
        price: 499,
      },
      {
        title: "IPL Watch Party",
        venue: "Phoenix Mall",
        date: "2026-08-30",
        price: 299,
      }
    ];

    for (let e of sampleEvents) {
      const existing = await Event.findOne({ where: { title: e.title } });
      if (!existing) {
        await Event.create({
          title: e.title,
          description: `Premium ${e.title}`,
          location: e.venue,
          date: e.date,
          startTime: '18:00:00',
          endTime: '22:00:00',
          capacity: 500,
          totalCapacity: 500,
          price: e.price,
          category: 'Premium',
          createdBy: user.id
        });
        console.log(`Created event: ${e.title}`);
      }
    }
    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedEvents();
