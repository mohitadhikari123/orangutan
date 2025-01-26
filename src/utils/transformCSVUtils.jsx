const NAME_MAPPINGS = {
  first_name: [
    "first_name", "firstname", "firstName", "f_name", "first_Name",
    "fst_name", "first name", "fname", "given_name", "givenname",
    "given name", "forename", "personal_name", "christian_name"
  ],
  middle_name: [
    "middle_name", "middlename", "middleName", "m_name", "middle_Name",
    "mid_name", "middle name", "mname", "middle_initial", "mi",
    "second_name", "additional_name", "patronymic"
  ],
  last_name: [
    "last_name", "lastname", "lastName", "l_name", "last_Name",
    "lst_name", "last name", "lname", "family_name", "surname",
    "familyname", "fam_name"
  ],
  phone_number: [
    "phone_number", "phone", "phonenumber", "phoneNumber", "contact",
    "contact_number", "mobile", "mobile_number", "cell", "cellphone",
    "tel", "telephone", "whatsapp", "contact_no", "mob",
    "ph_no", "phone_no"
  ],
  address_line_1: [
    "address_line_1", "address1", "address", "addressline1",
    "address_1", "primary_address", "street", "street_address",
    "addr1", "street1", "main_address", "house_address",
    "physical_address", "delivery_address"
  ],
  address_line_2: [
    "address_line_2", "address2", "addressline2", "address_2",
    "secondary_address", "street2", "addr2", "apt_number",
    "apartment", "suite", "unit", "building", "floor",
    "address_secondary", "additional_address"
  ],
  state: [
    "state", "province", "region", "statename", "state_name",
    "administrative_area", "division", "territory",
    "county", "prefecture"
  ],
  pin_code: [
    "pin_code", "pincode", "zipcode", "zip", "postal_code",
    "postalcode", "postal", "postcode", "ZIP", "postal_number",
    "post_index", "post_code", "zip_code", "pin", "postal_index_code",
  ],
  country: [
    "country", "countryname", "country_name", "nation",
    "country_code", "nationality", "country_of_residence"
  ]
};


export const transformCSVData = (csvData = []) => {
  const mapRow = (row) => {
    const transformedRow = {};

    // Loop through the defined mappings to populate standardized fields
    for (const [standardKey, possibleKeys] of Object.entries(NAME_MAPPINGS)) {
      const matchingKey = possibleKeys.find((key) => key in row);
      transformedRow[standardKey] = matchingKey ? row[matchingKey] : "";
    }

    // If first_name and last_name are not provided, try to split the name field
    if (!transformedRow.first_name && !transformedRow.last_name && row.name) {
      const nameParts = row.name.trim().split(" ");
      transformedRow.first_name = nameParts[0] || "";
      transformedRow.last_name = nameParts.slice(1).join(" ") || "";
    }

    return transformedRow;
  };

  return csvData.map(mapRow);
};
