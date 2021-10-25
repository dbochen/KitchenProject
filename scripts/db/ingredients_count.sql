SELECT name, count(qi.ingredient_id) as count FROM ingredient LEFT JOIN quantified_ingredient qi on ingredient.id = qi.ingredient_id
GROUP BY name
ORDER BY count;
