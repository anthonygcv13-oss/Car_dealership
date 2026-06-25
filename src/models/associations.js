const Brand = require('./brand.js');
const Model = require('./model.js');
const Vehicle = require('./vehicle.js');
const VehicleImage = require('./vehicle_image.js');
const Customer = require('./customer.js');
const Quote = require('./quote.js');

// Relación Brand <-> Model
Brand.hasMany(Model, { foreignKey: 'id_brand', as: 'models' });
Model.belongsTo(Brand, { foreignKey: 'id_brand', as: 'brand' });

// Relación Model <-> Vehicle
Model.hasMany(Vehicle, { foreignKey: 'id_model', as: 'vehicles' });
Vehicle.belongsTo(Model, { foreignKey: 'id_model', as: 'model' });

// Relación Vehicle <-> VehicleImage
Vehicle.hasMany(VehicleImage, { foreignKey: 'id_vehicle', as: 'images' });
VehicleImage.belongsTo(Vehicle, { foreignKey: 'id_vehicle', as: 'vehicle' });

// Relación Customer <-> Quote
Customer.hasMany(Quote, { foreignKey: 'id_customer', as: 'quotes' });
Quote.belongsTo(Customer, { foreignKey: 'id_customer', as: 'customer' });

// Relación Vehicle <-> Quote
Vehicle.hasMany(Quote, { foreignKey: 'id_vehicle', as: 'quotes' });
Quote.belongsTo(Vehicle, { foreignKey: 'id_vehicle', as: 'vehicle' });

module.exports = {
  Brand,
  Model,
  Vehicle,
  VehicleImage,
  Customer,
  Quote
};
