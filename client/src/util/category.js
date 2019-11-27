/* eslint-disable no-restricted-syntax */
import React from 'react';

export default class CategoryUtil {
  static convertToTreeData = (categories) => ([{
    key: '0.0',
    title: 'Root',
    children: categories.map((category) => ({
      key: category.id,
      title: category.name,
      ...category,
      icon: (<i className={category.icon} />),
      children: (category.children || []).map((subcategory) => ({
        key: subcategory.id,
        title: subcategory.name,
        ...subcategory,
        icon: (<i className={subcategory.icon} />),
      })),
    })),
  }])

  static convertToSelectOptions = (categories) => {
    const categoryOptions = [];
    categories.forEach((category) => {
      categoryOptions.push({ value: category.id, label: `|―${category.name}` });
      category.children.forEach((subcategory) => {
        categoryOptions.push({ value: subcategory.id, label: `|――${category.name} > ${subcategory.name}` });
      });
    });
    return categoryOptions;
  }

  static getCategoryById = (categories, categoryId) => {
    for (const category of categories) {
      if (category.id === categoryId) return category;
      const children = category.children || [];
      for (const subcategory of children) {
        if (subcategory.id === categoryId) {
          return subcategory;
        }
      }
    }
    return null;
  }
}
