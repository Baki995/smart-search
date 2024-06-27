CREATE OR REPLACE FUNCTION search_data(query_string TEXT)
RETURNS TABLE (source TEXT, id INTEGER, name VARCHAR(255)) AS $$
BEGIN
    RETURN QUERY
    WITH search_query AS (
        SELECT to_tsquery('english', query_string) AS query
    )

    SELECT tmp.source, tmp.id, tmp.name 
    FROM (
        SELECT 'brand' AS source, b.id, b.name
        FROM brands b, search_query
        WHERE name_search @@ search_query.query

        UNION ALL

        SELECT 'city' AS source, c.id, c.name
        FROM cities c, search_query
        WHERE name_search @@ search_query.query

        UNION ALL

        SELECT 'diet' AS source, d.id, d.name
        FROM diets d, search_query
        WHERE name_search @@ search_query.query

        UNION ALL

        SELECT 'dish_type' source, dt.id, dt.name
        FROM dish_types dt, search_query
        WHERE name_search @@ search_query.query
    ) as tmp;
END;
$$ LANGUAGE plpgsql;