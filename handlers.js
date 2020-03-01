const inputs = [];
const {
    stock,
    customers
} = require('./data/promo');


//TODO -----------------------------
const handletodoApp = (req, res) => {
    res.render('pages/todoApp', {
        inputs: inputs
    })
    console.log(inputs);

}
const handleData = (req, res) => {

    const input = req.body.input;

    inputs.push(input);
    res.redirect('/todos');
}
//TODO -----------------------------

//ORDER -----------------------------
let status;
let receivedData;

const handleformData = (req, res) => {
    //comment to double check this. 
    receivedData = req.body


    console.log(receivedData)

    customers.forEach(customer => {
        //will check if he is already an existing user
        if (receivedData.givenName === customer.givenName || receivedData.address === customer.address) {
            status = 550;
            // return res.json({error: '550'});
        } else {
            // NOT CURRENTLY A USER IN THE SYSTEM. // NEW USER 
            status = 200;
            // return res.json({status: "success"})
        }
    });
    

    // 
    //IF NOT FROM CANADA. 
    if (receivedData.country !== "Canada") {
        status = 650;

        //if he is from Canada.... meaning he will be able to buy.
    }  else if (receivedData.order === 'bottleks') {
        //must put ==, as it is a string
        if (stock.bottles == 0) {
            status = 450;
        }
    } else if (receivedData.order === 'socks') {
        if (stock.socks == 0) {
            status = 450;
        }
    } else if (receivedData.order === 'shirt') {
        //need to store the type of shirt here. 
        let shirtPicked = receivedData.size;
        switch (shirtPicked) {
            case 'small':
                if (stock.shirt.small == 0) {
                    status = 450;
                }
                break;
                //should be out of sotck here. 
                //keep in mind the quotations as we are wokring with strings. 
            case 'medium':
                if (stock.shirt.medium == 0) {
                    status = 450;
                break;
                }
            case 'large':
                if (stock.shirt.large == 0) {
                        status = 450;
                }
                break;
            case 'xlarge':
                if (stock.shirt.xlarge == 0) {
                        status = 450;
                }
                break;
                //this for missing information for the size of tshirt.  
            case 'undefined':
                status = 406;
                 break;

        }
    }
    //missing information of the order. 
    else if (receivedData.order === 'undefined') {
        status = 406;
    }

    //ALL THE STATUS MESASAGES. 
    switch (status) {
        case 550:
            res.status(550).json({
                status: '550',
                error: "Existing User"
            })
            break;
        case 200:
            res.status(200).json({
                status: 'success'
            })
            break;
        case 650:
            //if he is not from Canada. 
            res.status(650).json({
                status: '650',
                error: "Only Deliver in Canada!"
            })
            break;
        case 450:
            console.log(status)

            res.status(450).json({
                status: '450',
                error: "ITEM NOT IN STOCK!"
            })
            break;
        //MISSING INFORMATION!
        case 406: //not acceptable code. 
            console.log(status)
            res.status(406).json({
                status: 406,
                error: "Missing Information!"
            })
        default:
            // code block
    }
}


// HANDLE THE ORDER confirmation
const handleOrder = (req, res) => {
    let orderType = receivedData.order
    let image;
    switch (orderType) {
        case 'socks':
            image = '/order-form/assets/socks.jpg'
            break;
        case 'shirt':
            image = '/order-form/assets/tshirt.png'
            break;
        case 'bottleks':
            image = '/order-form/assets/bottle.png'
            break;

    }


    res.render('pages/orderConfirmed', {
        order: receivedData.order,
        name: receivedData.givenName,
        email: receivedData.email,
        address: receivedData.address,
        image: image,
        date: new Date()

    })
}
module.exports = {
    handletodoApp,
    handleData,
    handleformData,
    handleOrder
};