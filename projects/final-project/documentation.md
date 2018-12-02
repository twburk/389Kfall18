
# Maryland Activities

---

Name: Travis Burk

Date: 12/7/2018

Project Topic: 

URL: 

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`:     Name                 `Type: String`
- `Field 2`:     City                 `Type: String`
- `Field 3`:     ageRequirement       `Type: String`
- `Field 4`:     maxGroupCount        `Type: Number`
- `Field 5`:     dressCode            `Type: [String]`

Schema: 
```javascript
{
    name: {
        type: String
    },
    city: {
        type: String
    },
    ageRequirement: {
        type: String
    },
    maxGroupCount:{
        type: Number
    },
    dressCode: [String]
}
```

### 2. Add New Data

HTML form route: `/...`

POST endpoint route: `/api/...`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/...',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
       ...
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. View Data

GET endpoint route: `/api/activity`

### 4. Search Data

Search Field: `name`

### 5. Navigation Pages

Navigation Filters
1. Baltimore Activities -> `/baltimore_activities`
2. Age Restricted Activities -> `/restricted_activities`
3. Non Age Restricted Activities-> `/notRestricted_activities`
4. Alphabetical Activities -> `/activity_abc`
5. Max Group Order -> `/group_activities`