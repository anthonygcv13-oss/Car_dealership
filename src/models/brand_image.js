const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');

const BrandImage = sequelize.define('BrandImage', {
  id_brand_image: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  id_brand: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  url: { 
    type: DataTypes.STRING(500), 
    allowNull: false 
  },
  is_primary: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  display_order: { 
    type: DataTypes.SMALLINT, 
    defaultValue: 0 
  },
  created_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  },
  updated_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, {
  tableName: 'brand_image',
  timestamps: false
});

module.exports = BrandImage;
