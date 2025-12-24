
INSERT INTO "Category" ("id", "name", "slug", "icon", "description") VALUES 
('cat_food', 'Food & Snacks', 'food-and-snacks', '🍕', 'Satisfy your cravings with the best campus eats.'),
('cat_tech', 'Tech & Gadgets', 'tech-and-gadgets', '💻', 'Laptops, phones, and chargers at student prices.'),
('cat_books', 'Books & Notes', 'books-and-notes', '📚', 'Course materials, past questions, and novels.'),
('cat_fashion', 'Fashion', 'fashion', '👕', 'Look sharp on campus with the latest trends.'),
('cat_services', 'Services', 'services', '⚡', 'Haircuts, repairs, and tutoring services.'),
('cat_everything', 'Everything Else', 'everything-else', '🎯', 'Miscellaneous items for your hostel.')
ON CONFLICT ("slug") DO NOTHING;
