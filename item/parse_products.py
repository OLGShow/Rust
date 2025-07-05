import re
import json

def parse_product_data(raw_data):
    products = []
    lines = raw_data.strip().split('\n')
    for line in lines:
        # Regex to capture price, quantity (optional), and product name
        match = re.match(r'(\d+ RUB)(?: x(\d+))? (.+)', line)
        if match:
            price_str, quantity_str, name = match.groups()
            price = price_str.strip()
            quantity = int(quantity_str) if quantity_str else 1
            products.append({
                'name': name.strip(),
                'price': price,
                'quantity': quantity
            })
        else:
            # Handle cases where quantity might be missing or format is slightly different
            match = re.match(r'(\d+ RUB) (.+)', line)
            if match:
                price_str, name = match.groups()
                price = price_str.strip()
                products.append({
                    'name': name.strip(),
                    'price': price,
                    'quantity': 1 # Default quantity
                })
            else:
                print(f"Could not parse line: {line}")
    return products

with open('G:\cursor\css\item\products_raw_data.txt', 'r', encoding='utf-8') as f:
    raw_data = f.read()

parsed_products = parse_product_data(raw_data)

with open('G:\cursor\css\item\products_structured_data.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_products, f, ensure_ascii=False, indent=4)

print("Данные о продуктах успешно структурированы и сохранены в products_structured_data.json")


