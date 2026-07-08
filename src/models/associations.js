const Brand = require('./brand.js');
const Model = require('./model.js');
const Vehicle = require('./vehicle.js');
const VehicleImage = require('./vehicle_image.js');
const Customer = require('./customer.js');
const Quote = require('./quote.js');
const Role = require('./role.js');
const UserAccount = require('./user_account.js');
const VehicleSale = require('./vehicle_sale.js');
const Installment = require('./installment.js');
const Payment = require('./payment.js');
const BrandImage = require('./brand_image.js');
const VehicleVideo = require('./vehicle_video.js');

// Relación Brand <-> Model
Brand.hasMany(Model, { foreignKey: 'id_brand', as: 'models' });
Model.belongsTo(Brand, { foreignKey: 'id_brand', as: 'brand' });

// Relación Model <-> Vehicle
Model.hasMany(Vehicle, { foreignKey: 'id_model', as: 'vehicles' });
Vehicle.belongsTo(Model, { foreignKey: 'id_model', as: 'model' });

// Relación Vehicle <-> VehicleImage
Vehicle.hasMany(VehicleImage, { foreignKey: 'id_vehicle', as: 'images' });
VehicleImage.belongsTo(Vehicle, { foreignKey: 'id_vehicle', as: 'vehicle' });

// Relación Brand <-> BrandImage
Brand.hasMany(BrandImage, { foreignKey: 'id_brand', as: 'images' });
BrandImage.belongsTo(Brand, { foreignKey: 'id_brand', as: 'brand' });

// Relación Vehicle <-> VehicleVideo
Vehicle.hasMany(VehicleVideo, { foreignKey: 'id_vehicle', as: 'videos' });
VehicleVideo.belongsTo(Vehicle, { foreignKey: 'id_vehicle', as: 'vehicle' });

// Relación Customer <-> Quote
Customer.hasMany(Quote, { foreignKey: 'id_customer', as: 'quotes' });
Quote.belongsTo(Customer, { foreignKey: 'id_customer', as: 'customer' });

// Relación Vehicle <-> Quote
Vehicle.hasMany(Quote, { foreignKey: 'id_vehicle', as: 'quotes' });
Quote.belongsTo(Vehicle, { foreignKey: 'id_vehicle', as: 'vehicle' });

// Relación Role <-> UserAccount
Role.hasMany(UserAccount, { foreignKey: 'id_role', as: 'users' });
UserAccount.belongsTo(Role, { foreignKey: 'id_role', as: 'role' });

// Relaciones de Venta <-> Cuota e Historial de Facturación
VehicleSale.hasMany(Installment, { foreignKey: 'id_vehicle_sale', as: 'installments' });
Installment.belongsTo(VehicleSale, { foreignKey: 'id_vehicle_sale', as: 'sale' });

VehicleSale.hasMany(Payment, { foreignKey: 'id_vehicle_sale', as: 'payments' });
Payment.belongsTo(VehicleSale, { foreignKey: 'id_vehicle_sale', as: 'sale' });

Installment.hasMany(Payment, { foreignKey: 'id_installment', as: 'payments' });
Payment.belongsTo(Installment, { foreignKey: 'id_installment', as: 'installment' });

module.exports = {
  Brand,
  Model,
  Vehicle,
  VehicleImage,
  Customer,
  Quote,
  Role,
  UserAccount,
  VehicleSale,
  Installment,
  Payment,
  BrandImage,
  VehicleVideo
};
