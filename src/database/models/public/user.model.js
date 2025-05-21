'use strict';
import bcrypt from "bcrypt";

import { literal } from 'sequelize';
import { catchError } from '../../../utils/catchError.js';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nidn: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      validate: {
        notNull: {
          msg: 'nidn cannot be null',
        },
        notEmpty: {
          msg: 'nidn cannot be empty'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('admin', 'dekan', 'kaprodi', 'dosen'),
      defaultValue: 'dosen',
      allowNull: false,
      validate: {
        notNull: {
          msg: 'role cannot be null',
        },
        notEmpty: {
          msg: 'role cannot be empty'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password cannot be null',
        },
        notEmpty: {
          msg: 'password cannot be empty'
        }
      }
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if (this.password.length < 7) {
          throw new catchError('Password length must be grater than 7', 400)
        }
        if (value === this.password) {
          const hassPassword = bcrypt.hashSync(value, 10);
          this.setDataValue('password', hassPassword);
        }
        else {
          throw new catchError(
            'Password and confirm password must be the same',
            400
          );
        }
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: literal('CURRENT_TIMESTAMP'),
    },
    deletedAt: {
      type: DataTypes.DATE,
    }
  }, 
  {
    freezeTableName: true,
    modelName: 'User',
    paranoid: false
  });
  User.associate = models => {
    User.belongsTo(models.DataDosen, {
      foreignKey: 'nidn',
      targetKey: 'nidn',
      as: 'dataDosen'
    });
  };
  return User;
};