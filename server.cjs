// // const jsonServer = require("json-server");
// // const server = jsonServer.create();
// // const router = jsonServer.router("db.json");
// // const middlewares = jsonServer.defaults();

// // server.use(middlewares);
// // server.use(jsonServer.bodyParser);

// // // Custom nested route
// // server.get("/locations", (req, res) => {
// //   const db = router.db;
// //   const { partnerId } = req.query;

// //   let locations = db.get("locations").value();
// //   if (partnerId) {
// //     locations = locations.filter(l => String(l.partnerId) === String(partnerId));
// //   }

// //   const result = locations.map(location => ({
// //     ...location,
// //     menu:          db.get("menu").filter({ locationId: location.id }).value(),
// //     discounts:     db.get("discounts").filter({ locationId: location.id }).value(),
// //     hours:         db.get("hours").filter({ locationId: location.id }).value(),
// //     comments:      db.get("comments").filter({ locationId: location.id }).value(),
// //     notifications: db.get("notifications").filter({ locationId: location.id }).value(),
// //   }));

// //   res.json(result);
// // });

// // server.use(router);
// // server.listen(3001, () => {
// //   console.log("✅ JSON Server chạy tại http://localhost:3001");
// // });

// import jsonServer from 'json-server';
// const server = jsonServer.create();
// const router = jsonServer.router('db.json'); // Đảm bảo file db.json nằm cùng thư mục
// const middlewares = jsonServer.defaults();

// server.use(middlewares);
// server.use(router);

// server.listen(3001, () => {
//   console.log('JSON Server is running at http://localhost:3001');
// });


const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom route: trả về locations kèm nested data
server.get("/locations", (req, res) => {
  const db = router.db;
  const { partnerId } = req.query;

  let locations = db.get("locations").value();

  if (partnerId) {
    locations = locations.filter(
      (l) => String(l.partnerId) === String(partnerId)
    );
  }

  const result = locations.map((location) => ({
    ...location,
    menu: db.get("menu")
            .filter({ locationId: location.id })
            .value(),
    discounts: db.get("discounts")
                 .filter({ locationId: location.id })
                 .value(),
    hours: db.get("hours")
             .filter({ locationId: location.id })
             .value(),
    comments: db.get("comments")
                .filter({ locationId: location.id })
                .value(),
    notifications: db.get("notifications")
                     .filter({ locationId: location.id })
                     .value(),
  }));

  res.json(result);
});

// Các route khác (menu, discounts, hours...) vẫn hoạt động bình thường
server.use(router);

server.listen(3001, () => {
  console.log("✅ Server chạy tại http://localhost:3001");
});