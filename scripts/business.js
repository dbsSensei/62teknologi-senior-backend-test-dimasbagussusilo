const axios = require('axios')
const {faker} = require('@faker-js/faker');

(async () => {
        for (let i = 0; i < 10; i++) {
            const name = faker.commerce.productName()
            const address1 = faker.address.country()
            const address2 = faker.address.country()
            const address3 = faker.address.country()
            const city = faker.address.cityName()
            const country = faker.address.country()
            const state = faker.address.countryCode()
            const zip_code = faker.address.zipCode()
            const cross_streets = faker.address.street()

            const body = {
                alias: name.split(' ').join('-'),
                categories: [{
                    alias: faker.commerce.productName(), title: faker.commerce.productName()
                }, {
                    alias: "food", title: "Food"
                },],
                coordinates: {
                    latitude: faker.address.latitude(100, -10, 13), longitude: faker.address.longitude(100, -10, 13)
                },
                display_phone: faker.phone.number('(###)-###-###'),
                id: faker.datatype.hexadecimal({length: 20, case: 'mixed'}),
                image_url: `https://source.unsplash.com/random/?pattern&${Math.round(Math.random(1, 9999).toString())}`,
                is_closed: faker.datatype.boolean(),
                location: {
                    address1,
                    address2,
                    address3,
                    city,
                    country,
                    state,
                    zip_code,
                    display_address: [address1, address2, address3, `${city}, ${state} ${zip_code}`,],
                    cross_streets,
                },
                name,
                phone: faker.phone.number('+############'),
                price: '$'.repeat(Math.floor(Math.random() * 4) + 1),
                rating: faker.datatype.number({max: 5}),
                review_count: faker.datatype.number({max: 1000}),
                transactions: [faker.commerce.department(), faker.commerce.department()],
                url: faker.image.business(),
            }

            try {
                const createBusinessURL = "http://env-9245888.user.cloudjkt01.com/v1/business"
                const createdBusiness = await axios.post(createBusinessURL, body)
                console.log(createdBusiness.data)
            } catch (error) {
                console.log("ERROR", error.response.data)
            }

        }
    }
)()