import json

def try_parse_int(string):
    try:
        return int(string)
    except:
        return string


def get_views_record_count_json(parsedJson):
    """Given a json response from views, parse and get the total count of records stored by views.
    parsedJson should contain output from json.loads(response.text)"""
    for records in parsedJson.items():
        if not records[1]:
            # no results were returned, stop parsing before error
            break
    trim_before_count = records[0][records[0].index("count") + 7 :]
    trim_after_count = trim_before_count[: trim_before_count.index('"')]
    total = int(trim_after_count)
    return total

def parse_valuelist_items(response):
    parsed = json.loads(response.text)

    # Check if no items were returned from Views:
    if "items" not in parsed or len(parsed["items"]) == 0:
        return {
            "count": 0,
            "results": [],
        }

    return {
        "count": len(parsed["items"]),
        "results": translate_valuelist_items_fields(parsed["items"]),
    }


def translate_valuelist_items_fields(itemsList):
    return [val for val in itemsList.values()]
