import os

def generateEmailTemplateHtml(emailTemplateName: str, replacements: dict) -> str:
    '''
    Generates the HTML markup for an email template with the specified
    name and key-value pair replacements in the 'replacements' dict.

    Example usage:
    generateEmailTemplateHtml("mentorAccountCreation", {"mentorFirstName": "Linda", "createAccountButtonLink": "https..."}
    '''

    # get html template file path
    script_dir = os.path.dirname(__file__)
    rel_path = "templates/" + emailTemplateName + ".html"
    abs_file_path = os.path.join(script_dir, rel_path)

    # read html markup in file as string
    templateFile = open(abs_file_path, "r")
    templateHtmlString = templateFile.read()
    templateFile.close()

    for replacementKey, replacementValue in replacements.items():
        templateHtmlString = \
            templateHtmlString.replace("{{" + replacementKey + "}}", replacementValue)
    
    return templateHtmlString