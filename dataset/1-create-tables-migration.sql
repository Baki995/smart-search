CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    name_search TSVECTOR  
      GENERATED ALWAYS AS (to_tsvector('english', name)) STORED
);

CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    name_search TSVECTOR  
      GENERATED ALWAYS AS (to_tsvector('english', name)) STORED
);

CREATE TABLE dish_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    name_search TSVECTOR  
      GENERATED ALWAYS AS (to_tsvector('english', name)) STORED
);

CREATE TABLE diets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    name_search TSVECTOR  
      GENERATED ALWAYS AS (to_tsvector('english', name)) STORED
);

CREATE INDEX tsv_cities_idx ON cities USING GIN(name_search);
CREATE INDEX tsv_brands_idx ON brands USING GIN(name_search);
CREATE INDEX tsv_dish_types_idx ON dish_types USING GIN(name_search);
CREATE INDEX tsv_diets_idx ON diets USING GIN(name_search);