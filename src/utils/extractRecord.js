  const extractRecord = (data) => {
    let responseData = {
        name:"",
        title:"",
        role: "",
        severity: "",
        email: "",
        image: "",
        color: ""
    }
        data[0].map((item, idx) => {
            responseData.id = item.number;
            responseData.title = item.rule.name;
            responseData.name = item.rule.id;
            responseData.role = 213;
            responseData.severity = item.rule.security_severity_level;
            responseData.email = "";
            responseData.image = "" // To be done later
            responseData.color = "" // Later
        })
        return responseData;
  }