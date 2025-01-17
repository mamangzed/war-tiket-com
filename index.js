const axios = require('axios');
const URL_API = 'https://www.tiket.com';
const chalk = require('chalk');
const readlineSync = require('readline-sync');
const showMenu = (options) => {
    console.log('[+] Pilih salah satu:');
    options.forEach(option => {
      console.log(`    ${option.key}. ${option.value}`);
    });
  
    const choice = readlineSync.question('    Masukan pilihan kamu: ');
  
    const selectedOption = options.find(option => option.key === parseInt(choice));
  
    if (selectedOption) {
      console.log(chalk.magenta(`    Kamu memilih: ${selectedOption.value}`));
      return selectedOption.value;
    } else {
      console.log('Invalid choice. Please try again.');
      showMenu(options);
    }
  };

  const masukanTanggal = () => {
    const regex = /^\d{8}$/; 
  
    let date = readlineSync.question('[+] Masukan tanggal dengan format YYYYMMDD: ');
  
    while (!regex.test(date)) {
      console.log(chalk.yellow('Invalid format. Please enter the date in YYYYMMDD format.'));
      date = readlineSync.question('[+] Masukan tanggal dengan format YYYYMMDD: ');
    }
  
    return date;
  }; 

  const convertPriceToInt = (priceStr) => {
    const pricePart = priceStr.split(',')[0]; 
    return parseInt(pricePart.replace('Rp', '').replace('.', '').trim()); 
  };
  
  const pilihSatuKereta = (trains, selection) => {
    const trainsWithPrices = trains.map(train => ({
      ...train,
      priceInt: convertPriceToInt(train.price.value) 
    }));
  
    trainsWithPrices.sort((a, b) => a.priceInt - b.priceInt);
  
    switch (selection.toLowerCase()) {
      case 'termurah': 
        return trainsWithPrices[0]; 
      case 'termahal': 
        return trainsWithPrices[trainsWithPrices.length - 1]; 
      case 'tengah':
        return trainsWithPrices[Math.floor(trainsWithPrices.length / 2)]; 
      default:
        return null; 
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString); 
  
    const year = date.getFullYear(); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
  
    return `${year}-${month}-${day}`;
  };
const beautyConsole = ({
  tipe,
  logInfo,
  tipeConsole
}) => {
  const separator = '─────────────────────────────────────────────────────────────────';

  console.log(chalk[tipeConsole]('╔════════════════════════════════════════════════════════════════╗'));

  console.log(chalk[tipeConsole]('║') + ' [' + new Date().toISOString().slice(0, 19).replace("T", " ") + '] ' + chalk[tipeConsole](tipe));

  logInfo.forEach((info, index) => {
    for (const [key, value] of Object.entries(info)) {
      console.log(chalk[tipeConsole]('║') + chalk[tipeConsole](` ${value.logname}: `) + chalk.whiteBright(`${value.value}`));
    }

    if (index < logInfo.length - 1) {
      console.log(chalk[tipeConsole]('║') + chalk[tipeConsole](`${separator}`));
    }
  });

  console.log(chalk[tipeConsole]('╚════════════════════════════════════════════════════════════════╝'));
};

const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
};

const extractCode = (str) => {
    const regex = /\[([^\]]+)\]/;  
    const match = str.match(regex); 
  
    return match ? match[1] : null; 
  };

const applyOrder = async (cartId,secret,contact,passengers) => {
    const url = `${URL_API}/ms-gateway/tix-train-trx/v4/train/carts/${cartId}?secret=${secret}`;

    const headers = {
        'Content-Type': 'text/plain;charset=UTF-8',
        'X-Country-Id': 'id',
        'X-Cookie-Session-V2': 'true',
        'Accept-Language': 'id',
        'X-Audience': 'tiket.com',
        'Currency': 'IDR',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.140 Safari/537.36',
        'Sec-Ch-Ua-Platform': 'Windows',
        'Sec-Ch-Ua': 'Chromium;v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Bitness': '',
        'Sec-Ch-Ua-Model': '',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        //'Referer': 'https://www.tiket.com/order/add/train?d=GMR&dt=STATION&a=TG&at=STATION&date=2025-01-17&adult=1&infant=0&originLabel=Gambir+%28GMR%29&destinationLabel=Tegal+%28TG%29&tripType=oneway&productType=train&cartId=67897393c5a7b963f5bed49a&secret=98b4a600-eaf9-48ea-af54-4201f868934e',
        'Accept': '*/*',
        'Origin': 'https://www.tiket.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Priority': 'u=1, i',
        'Sec-Ch-Ua-Full-Version-List': '',
        'X-Request-Id': '',
        'Sec-Ch-Ua-Arch': '',
        'Sec-Ch-Ua-Full-Version': '',
        'Sec-Ch-Ua-Platform-Version': '',
        'Deviceid': '8d0a542e-7c0e-4744-aeed-cfae68410878',
        'X-Currency': 'IDR',
        'Cookie': 'device_id=8d0a542e-7c0e-4744-aeed-cfae68410878; session_access_token=eyJraWQiOiJjYjNmdHNtLXNQNnNqWGd0alBTZG5HcDByUWJ1UXJJbiJ9.eyJhdWQiOiJ0aWtldC5jb20iLCJzdWIiOiI2Nzg4ZjU2NjUyMWVlZDcwNjMyYTI3ZjUiLCJuYmYiOjE3MzcwMjg5NjYsImlzcyI6Imh0dHBzOi8vd3d3LnRpa2V0LmNvbSIsImV4cCI6MTczODIzODU2Nn0.qqQHIOjlU4M9_aFY6SY8ra9IiYQe35hpSXh3bdDQ3t31rOchMCowtBfOF98rkHeo; session_refresh_token=eyJraWQiOiJ4LXRhMDZsczE3YlFGMldLak1pWlJkR2huYXBPWjVTMCJ9.eyJhdWQiOiJ0aWtldC5jb20vcnQiLCJzdWIiOiI2Nzg4ZjU2NjUyMWVlZDcwNjMyYTI3ZjUiLCJuYmYiOjE3MzcwMjg5NjYsImlzcyI6Imh0dHBzOi8vd3d3LnRpa2V0LmNvbSIsImV4cCI6MTc2ODU4ODk2Nn0.ItKzvGdHFU2dVOSDG4jW9CGy3Y0k19OPEHX99h6wx--342he2XqFmSzv3wvxvaS8; _ga=GA1.1.1106760593.1737028968; device_id=8d0a542e-7c0e-4744-aeed-cfae68410878; _gcl_au=1.1.66786922.1737028969; _fbp=fb.1.1737028970220.113514744337517498; _tt_enable_cookie=1; _ttp=d_3P0NLDN_bCIJ1iXcQzyrMrfWZ.tt.1; country_code=id; userlang=id; tiket_currency=IDR; _cfuvid=EMBPxACJrwTtzthZRJCRG451qVDV4pCHYuoLY.N8mQo-1737055996144-0.0.1.1-604800000; AMP_MKTG_b34eb5901c=JTdCJTdE; app_is_desktop=true; country_code=id; app_is_webview=false; app_logger_correlation_id=ea44df29-0c28-4d3d-9b61-5bb68ce17a51; __cf_bm=bnsvRu_kA.QOWGdrWv7nQ1vEdCzkfdJ5I_iXV3dPWbk-1737061253-1.0.1.1-tWuWGmKSuCuAekaYiaKvBp4CRMbF8ThbAru2j6lQzzRKnREoDzI5CcIJmZlFNU0IE2Tz0flR2yRbPPgUoZXDDtxia5V6sjmQCv0Et.uzc2E; cf_clearance=bnDWKYH6zQNl_CImFGj0qPD_kLqTizEBRdsK4Zm8n_w-1737061253-1.2.1.1-CVn0s3dlrkJ66.7X9xg4WUxiuAj11w1h5XeV5oWRd1V9G33O_8.JeHMz7jNDGoZWuSZml6dU3ak5HG1b9TL2niulXyhZU9Ey7AizeDTAdFsc8p2Lyd7nWcHZA4Gm66zFWiSFRaMbYh76PCexl_DCWdi4bqfoneUd.cnUnGiUVkCSf6f0aJFvG57TGbvRBCLj5lSaydXQ5Gihro1JeE7hnXJgIrGEl50mSTBcQ7POQ0CHvGiayzT2W_r7LBm2PfwxtrgmmjsTlR.O_ujdGpGl6D4oC0n03gEYEks.b4Imj7DO8dBQ0BPcgGKFmW5KkWnuLQOS9uvPIS6N3LuwDV8Q2Q; _ga_7H6ZDP2ZXG=GS1.1.1737061253.3.1.1737061340.57.0.0; AMP_b34eb5901c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI4ZDBhNTQyZS03YzBlLTQ3NDQtYWVlZC1jZmFlNjg0MTA4NzglMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjIlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzM3MDYxMjUyNjY2JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTczNzA2MTM0MDkzMiUyQyUyMmxhc3RFdmVudElkJTIyJTNBMTY3JTdE',
    };

    const data = {
        cartId: cartId,
        secret: secret,
        contact: {
            title: 'mr',
            fullName: 'wanda hadis suara',
            areaCode: '+62',
            phone: '818839654',
            emailAddress: 'wandahadissuara@gmail.com',
            profileId: '',
        },
        passengers: [
            {
                paxType: 'ADULT',
                title: 'Mr',
                fullName: 'wanda hadis suara',
                profileId: '',
                identityType: 'identityNumber',
                identityNumber: '3326768456472652',
                passportNumber: '',
            },
        ],
    };

    axios.post(url, data, { headers })
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

const addToCart = async (args) => {
    const url = `${URL_API}/ms-gateway/tix-train-trx/v4/train/carts?result=summary`;

    const headers = {
        'Content-Type': 'text/plain;charset=UTF-8',
        'X-Country-Id': 'id',
        'X-Cookie-Session-V2': 'true',
        'Accept-Language': 'id',
        'X-Audience': 'tiket.com',
        'Currency': 'IDR',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.140 Safari/537.36',
        'Sec-Ch-Ua-Platform': 'Windows',
        'Sec-Ch-Ua': 'Chromium;v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Bitness': '',
        'Sec-Ch-Ua-Model': '',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        //'Referer': 'https://www.tiket.com/order/add/train?d=GMR&dt=STATION&a=TG&at=STATION&date=2025-01-17&adult=1&infant=0&originLabel=Gambir+%28GMR%29&destinationLabel=Tegal+%28TG%29&tripType=oneway&productType=train&cartId=67897393c5a7b963f5bed49a&secret=98b4a600-eaf9-48ea-af54-4201f868934e',
        'Accept': '*/*',
        'Origin': 'https://www.tiket.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Priority': 'u=1, i',
        'Sec-Ch-Ua-Full-Version-List': '',
        'X-Request-Id': '',
        'Sec-Ch-Ua-Arch': '',
        'Sec-Ch-Ua-Full-Version': '',
        'Sec-Ch-Ua-Platform-Version': '',
        'Deviceid': '8d0a542e-7c0e-4744-aeed-cfae68410878',
        'X-Currency': 'IDR',
        'Cookie': 'device_id=8d0a542e-7c0e-4744-aeed-cfae68410878; session_access_token=eyJraWQiOiJjYjNmdHNtLXNQNnNqWGd0alBTZG5HcDByUWJ1UXJJbiJ9.eyJhdWQiOiJ0aWtldC5jb20iLCJzdWIiOiI2Nzg4ZjU2NjUyMWVlZDcwNjMyYTI3ZjUiLCJuYmYiOjE3MzcwMjg5NjYsImlzcyI6Imh0dHBzOi8vd3d3LnRpa2V0LmNvbSIsImV4cCI6MTczODIzODU2Nn0.qqQHIOjlU4M9_aFY6SY8ra9IiYQe35hpSXh3bdDQ3t31rOchMCowtBfOF98rkHeo; session_refresh_token=eyJraWQiOiJ4LXRhMDZsczE3YlFGMldLak1pWlJkR2huYXBPWjVTMCJ9.eyJhdWQiOiJ0aWtldC5jb20vcnQiLCJzdWIiOiI2Nzg4ZjU2NjUyMWVlZDcwNjMyYTI3ZjUiLCJuYmYiOjE3MzcwMjg5NjYsImlzcyI6Imh0dHBzOi8vd3d3LnRpa2V0LmNvbSIsImV4cCI6MTc2ODU4ODk2Nn0.ItKzvGdHFU2dVOSDG4jW9CGy3Y0k19OPEHX99h6wx--342he2XqFmSzv3wvxvaS8; _ga=GA1.1.1106760593.1737028968; device_id=8d0a542e-7c0e-4744-aeed-cfae68410878; _gcl_au=1.1.66786922.1737028969; _fbp=fb.1.1737028970220.113514744337517498; _tt_enable_cookie=1; _ttp=d_3P0NLDN_bCIJ1iXcQzyrMrfWZ.tt.1; country_code=id; userlang=id; tiket_currency=IDR; _cfuvid=EMBPxACJrwTtzthZRJCRG451qVDV4pCHYuoLY.N8mQo-1737055996144-0.0.1.1-604800000; AMP_MKTG_b34eb5901c=JTdCJTdE; app_is_desktop=true; country_code=id; app_is_webview=false; app_logger_correlation_id=ea44df29-0c28-4d3d-9b61-5bb68ce17a51; __cf_bm=bnsvRu_kA.QOWGdrWv7nQ1vEdCzkfdJ5I_iXV3dPWbk-1737061253-1.0.1.1-tWuWGmKSuCuAekaYiaKvBp4CRMbF8ThbAru2j6lQzzRKnREoDzI5CcIJmZlFNU0IE2Tz0flR2yRbPPgUoZXDDtxia5V6sjmQCv0Et.uzc2E; cf_clearance=bnDWKYH6zQNl_CImFGj0qPD_kLqTizEBRdsK4Zm8n_w-1737061253-1.2.1.1-CVn0s3dlrkJ66.7X9xg4WUxiuAj11w1h5XeV5oWRd1V9G33O_8.JeHMz7jNDGoZWuSZml6dU3ak5HG1b9TL2niulXyhZU9Ey7AizeDTAdFsc8p2Lyd7nWcHZA4Gm66zFWiSFRaMbYh76PCexl_DCWdi4bqfoneUd.cnUnGiUVkCSf6f0aJFvG57TGbvRBCLj5lSaydXQ5Gihro1JeE7hnXJgIrGEl50mSTBcQ7POQ0CHvGiayzT2W_r7LBm2PfwxtrgmmjsTlR.O_ujdGpGl6D4oC0n03gEYEks.b4Imj7DO8dBQ0BPcgGKFmW5KkWnuLQOS9uvPIS6N3LuwDV8Q2Q; _ga_7H6ZDP2ZXG=GS1.1.1737061253.3.1.1737061340.57.0.0; AMP_b34eb5901c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI4ZDBhNTQyZS03YzBlLTQ3NDQtYWVlZC1jZmFlNjg0MTA4NzglMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjIlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzM3MDYxMjUyNjY2JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTczNzA2MTM0MDkzMiUyQyUyMmxhc3RFdmVudElkJTIyJTNBMTY3JTdE',
    };

    const data = {
        "passengerCount": {
            "adult": 1,
            "infant": 0
        },
        "selectedJourneys": {
            "depart": {
                "schedules": [
                    {
                        "id": args.id,
                        "originCode": args.stasiunAsal,
                        "destinationCode": args.stasiunTujuan,
                        "departDate": args.tanggal,
                        "subClass": args.subClass,
                        "trainNumber": args.trainNumber,
                        "wagonClass": args.wagonClass
                    }
                ]
            }
        },
        "productType": "TRAIN"
    };

    try {
        const response = await axios.post(url, data, { headers });
        if (response.data.code === 'SUCCESS') {
            return [{
                cartId: {logname: 'Cart ID', value: response.data.data.id},
                secretId: {logname: 'Secret ID', value: response.data.data.secret}
            }]
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

const addPassenger = async (args) => {
    const url = `${URL_API}/ms-gateway/tix-train-trx/v4/train/carts/${args.cartId}?secret=${args.secretId}`;

    const headers = {
        'Content-Type': 'text/plain;charset=UTF-8',
        'X-Country-Id': 'id',
        'X-Cookie-Session-V2': 'true',
        'Accept-Language': 'id',
        'X-Audience': 'tiket.com',
        'Currency': 'IDR',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.140 Safari/537.36',
        'Sec-Ch-Ua-Platform': 'Windows',
        'Sec-Ch-Ua': 'Chromium;v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Bitness': '',
        'Sec-Ch-Ua-Model': '',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        //'Referer': 'https://www.tiket.com/order/add/train?d=GMR&dt=STATION&a=TG&at=STATION&date=2025-01-17&adult=1&infant=0&originLabel=Gambir+%28GMR%29&destinationLabel=Tegal+%28TG%29&tripType=oneway&productType=train&cartId=67897393c5a7b963f5bed49a&secret=98b4a600-eaf9-48ea-af54-4201f868934e',
        'Accept': '*/*',
        'Origin': 'https://www.tiket.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Priority': 'u=1, i',
        'Sec-Ch-Ua-Full-Version-List': '',
        'X-Request-Id': '',
        'Sec-Ch-Ua-Arch': '',
        'Sec-Ch-Ua-Full-Version': '',
        'Sec-Ch-Ua-Platform-Version': '',
        'Deviceid': '8d0a542e-7c0e-4744-aeed-cfae68410878',
        'X-Currency': 'IDR',
        'Cookie': 'device_id=8d0a542e-7c0e-4744-aeed-cfae68410878; session_access_token=eyJraWQiOiJjYjNmdHNtLXNQNnNqWGd0alBTZG5HcDByUWJ1UXJJbiJ9.eyJhdWQiOiJ0aWtldC5jb20iLCJzdWIiOiI2Nzg4ZjU2NjUyMWVlZDcwNjMyYTI3ZjUiLCJuYmYiOjE3MzcwMjg5NjYsImlzcyI6Imh0dHBzOi8vd3d3LnRpa2V0LmNvbSIsImV4cCI6MTczODIzODU2Nn0.qqQHIOjlU4M9_aFY6SY8ra9IiYQe35hpSXh3bdDQ3t31rOchMCowtBfOF98rkHeo; session_refresh_token=eyJraWQiOiJ4LXRhMDZsczE3YlFGMldLak1pWlJkR2huYXBPWjVTMCJ9.eyJhdWQiOiJ0aWtldC5jb20vcnQiLCJzdWIiOiI2Nzg4ZjU2NjUyMWVlZDcwNjMyYTI3ZjUiLCJuYmYiOjE3MzcwMjg5NjYsImlzcyI6Imh0dHBzOi8vd3d3LnRpa2V0LmNvbSIsImV4cCI6MTc2ODU4ODk2Nn0.ItKzvGdHFU2dVOSDG4jW9CGy3Y0k19OPEHX99h6wx--342he2XqFmSzv3wvxvaS8; _ga=GA1.1.1106760593.1737028968; device_id=8d0a542e-7c0e-4744-aeed-cfae68410878; _gcl_au=1.1.66786922.1737028969; _fbp=fb.1.1737028970220.113514744337517498; _tt_enable_cookie=1; _ttp=d_3P0NLDN_bCIJ1iXcQzyrMrfWZ.tt.1; country_code=id; userlang=id; tiket_currency=IDR; _cfuvid=EMBPxACJrwTtzthZRJCRG451qVDV4pCHYuoLY.N8mQo-1737055996144-0.0.1.1-604800000; AMP_MKTG_b34eb5901c=JTdCJTdE; app_is_desktop=true; country_code=id; app_is_webview=false; app_logger_correlation_id=ea44df29-0c28-4d3d-9b61-5bb68ce17a51; __cf_bm=bnsvRu_kA.QOWGdrWv7nQ1vEdCzkfdJ5I_iXV3dPWbk-1737061253-1.0.1.1-tWuWGmKSuCuAekaYiaKvBp4CRMbF8ThbAru2j6lQzzRKnREoDzI5CcIJmZlFNU0IE2Tz0flR2yRbPPgUoZXDDtxia5V6sjmQCv0Et.uzc2E; cf_clearance=bnDWKYH6zQNl_CImFGj0qPD_kLqTizEBRdsK4Zm8n_w-1737061253-1.2.1.1-CVn0s3dlrkJ66.7X9xg4WUxiuAj11w1h5XeV5oWRd1V9G33O_8.JeHMz7jNDGoZWuSZml6dU3ak5HG1b9TL2niulXyhZU9Ey7AizeDTAdFsc8p2Lyd7nWcHZA4Gm66zFWiSFRaMbYh76PCexl_DCWdi4bqfoneUd.cnUnGiUVkCSf6f0aJFvG57TGbvRBCLj5lSaydXQ5Gihro1JeE7hnXJgIrGEl50mSTBcQ7POQ0CHvGiayzT2W_r7LBm2PfwxtrgmmjsTlR.O_ujdGpGl6D4oC0n03gEYEks.b4Imj7DO8dBQ0BPcgGKFmW5KkWnuLQOS9uvPIS6N3LuwDV8Q2Q; _ga_7H6ZDP2ZXG=GS1.1.1737061253.3.1.1737061340.57.0.0; AMP_b34eb5901c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI4ZDBhNTQyZS03YzBlLTQ3NDQtYWVlZC1jZmFlNjg0MTA4NzglMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjIlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzM3MDYxMjUyNjY2JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTczNzA2MTM0MDkzMiUyQyUyMmxhc3RFdmVudElkJTIyJTNBMTY3JTdE',
    };

    const data = {
        "cartId": args.cartId,
        "secret": args.secretId,
        "contact": {
            "title": args.title.toLowerCase(),
            "fullName": args.fullName,
            "areaCode": "+62",
            "phone": args.phone,
            "emailAddress": args.email,
            "profileId": ""
        },
        "passengers": [
            {
                "paxType": "ADULT",
                "title": args.title,
                "fullName": args.fullName,
                "profileId": "",
                "identityType": "identityNumber",
                "identityNumber": args.nik,
                "passportNumber": ""
            }
        ]
    };

    try {
        const response = await axios.post(url, data, { headers });
       
        if (response.data.code === 'SUCCESS') {
            return true;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

const payment = async (args) => {
    const url = `${URL_API}/ms-gateway/tix-train-trx/v6/train/orders`;

    const headers = {
        'Content-Type': 'text/plain;charset=UTF-8',
        'X-Country-Id': 'id',
        'X-Cookie-Session-V2': 'true',
        'Accept-Language': 'id',
        'X-Audience': 'tiket.com',
        'Currency': 'IDR',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.140 Safari/537.36',
        'Sec-Ch-Ua-Platform': 'Windows',
        'Sec-Ch-Ua': 'Chromium;v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Bitness': '',
        'Sec-Ch-Ua-Model': '',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        //'Referer': 'https://www.tiket.com/order/add/train?d=GMR&dt=STATION&a=TG&at=STATION&date=2025-01-17&adult=1&infant=0&originLabel=Gambir+%28GMR%29&destinationLabel=Tegal+%28TG%29&tripType=oneway&productType=train&cartId=67897393c5a7b963f5bed49a&secret=98b4a600-eaf9-48ea-af54-4201f868934e',
        'Accept': '*/*',
        'Origin': 'https://www.tiket.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Priority': 'u=1, i',
        'Sec-Ch-Ua-Full-Version-List': '',
        'X-Request-Id': '',
        'Sec-Ch-Ua-Arch': '',
        'Sec-Ch-Ua-Full-Version': '',
        'Sec-Ch-Ua-Platform-Version': '',
        'Deviceid': '8d0a542e-7c0e-4744-aeed-cfae68410878',
        'X-Currency': 'IDR',
        'Cookie': 'device_id=8d0a542e-7c0e-4744-aeed-cfae68410878; session_access_token=eyJraWQiOiJjYjNmdHNtLXNQNnNqWGd0alBTZG5HcDByUWJ1UXJJbiJ9.eyJhdWQiOiJ0aWtldC5jb20iLCJzdWIiOiI2Nzg4ZjU2NjUyMWVlZDcwNjMyYTI3ZjUiLCJuYmYiOjE3MzcwMjg5NjYsImlzcyI6Imh0dHBzOi8vd3d3LnRpa2V0LmNvbSIsImV4cCI6MTczODIzODU2Nn0.qqQHIOjlU4M9_aFY6SY8ra9IiYQe35hpSXh3bdDQ3t31rOchMCowtBfOF98rkHeo; session_refresh_token=eyJraWQiOiJ4LXRhMDZsczE3YlFGMldLak1pWlJkR2huYXBPWjVTMCJ9.eyJhdWQiOiJ0aWtldC5jb20vcnQiLCJzdWIiOiI2Nzg4ZjU2NjUyMWVlZDcwNjMyYTI3ZjUiLCJuYmYiOjE3MzcwMjg5NjYsImlzcyI6Imh0dHBzOi8vd3d3LnRpa2V0LmNvbSIsImV4cCI6MTc2ODU4ODk2Nn0.ItKzvGdHFU2dVOSDG4jW9CGy3Y0k19OPEHX99h6wx--342he2XqFmSzv3wvxvaS8; _ga=GA1.1.1106760593.1737028968; device_id=8d0a542e-7c0e-4744-aeed-cfae68410878; _gcl_au=1.1.66786922.1737028969; _fbp=fb.1.1737028970220.113514744337517498; _tt_enable_cookie=1; _ttp=d_3P0NLDN_bCIJ1iXcQzyrMrfWZ.tt.1; country_code=id; userlang=id; tiket_currency=IDR; _cfuvid=EMBPxACJrwTtzthZRJCRG451qVDV4pCHYuoLY.N8mQo-1737055996144-0.0.1.1-604800000; AMP_MKTG_b34eb5901c=JTdCJTdE; app_is_desktop=true; country_code=id; app_is_webview=false; app_logger_correlation_id=ea44df29-0c28-4d3d-9b61-5bb68ce17a51; __cf_bm=bnsvRu_kA.QOWGdrWv7nQ1vEdCzkfdJ5I_iXV3dPWbk-1737061253-1.0.1.1-tWuWGmKSuCuAekaYiaKvBp4CRMbF8ThbAru2j6lQzzRKnREoDzI5CcIJmZlFNU0IE2Tz0flR2yRbPPgUoZXDDtxia5V6sjmQCv0Et.uzc2E; cf_clearance=bnDWKYH6zQNl_CImFGj0qPD_kLqTizEBRdsK4Zm8n_w-1737061253-1.2.1.1-CVn0s3dlrkJ66.7X9xg4WUxiuAj11w1h5XeV5oWRd1V9G33O_8.JeHMz7jNDGoZWuSZml6dU3ak5HG1b9TL2niulXyhZU9Ey7AizeDTAdFsc8p2Lyd7nWcHZA4Gm66zFWiSFRaMbYh76PCexl_DCWdi4bqfoneUd.cnUnGiUVkCSf6f0aJFvG57TGbvRBCLj5lSaydXQ5Gihro1JeE7hnXJgIrGEl50mSTBcQ7POQ0CHvGiayzT2W_r7LBm2PfwxtrgmmjsTlR.O_ujdGpGl6D4oC0n03gEYEks.b4Imj7DO8dBQ0BPcgGKFmW5KkWnuLQOS9uvPIS6N3LuwDV8Q2Q; _ga_7H6ZDP2ZXG=GS1.1.1737061253.3.1.1737061340.57.0.0; AMP_b34eb5901c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI4ZDBhNTQyZS03YzBlLTQ3NDQtYWVlZC1jZmFlNjg0MTA4NzglMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjIlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzM3MDYxMjUyNjY2JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTczNzA2MTM0MDkzMiUyQyUyMmxhc3RFdmVudElkJTIyJTNBMTY3JTdE',
    };

    const data = {
        "cartId": args.cartId,
        "secret": args.secretId,
        "insurances": [
            {
                "type": "tiket-trainrefund-aswata-public-exowt-417",
                "applyInsurance": false
            }
        ],
        "voucherIds": []
    };

    try {
        const response = await axios.post(url, data, { headers });
       
        if (response.data.code === 'SUCCESS') {
            return {
                id: response.data.data.order.id,
                hash: response.data.data.order.hash,
                link: `https://payment.tiket.com/next/v4?order_id=${response.data.data.order.id}&order_hash=${response.data.data.order.hash}`
            };
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

const searchTrain = async (orig, dest, date,kelasKereta,hargaMaksimun) => {
    const url = `${URL_API}/ms-gateway/tix-train-search-v2/v5/train/journeys?orig=${orig}&otype=STATION&dest=${dest}&dtype=STATION&ttype=ONE_WAY&ddate=${date}&rdate=&acount=1&icount=0`;
    const headers = {
        'Content-Type': 'text/plain;charset=UTF-8',
        'X-Country-Id': 'id',
        'X-Cookie-Session-V2': 'true',
        'Accept-Language': 'id',
        'X-Audience': 'tiket.com',
        'Currency': 'IDR',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.140 Safari/537.36',
        'Sec-Ch-Ua-Platform': 'Windows',
        'Sec-Ch-Ua': 'Chromium;v="131", "Not_A Brand";v="24"',
        'Sec-Ch-Ua-Bitness': '',
        'Sec-Ch-Ua-Model': '',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Accept': '*/*',
        'Origin': 'https://www.tiket.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Priority': 'u=1, i',
        'Sec-Ch-Ua-Full-Version-List': '',
        'X-Request-Id': '',
        'Sec-Ch-Ua-Arch': '',
        'Sec-Ch-Ua-Full-Version': '',
        'Sec-Ch-Ua-Platform-Version': '',
        'Deviceid': '8d0a542e-7c0e-4744-aeed-cfae68410878',
        'X-Currency': 'IDR',
        'Cookie': 'device_id=8d0a542e-7c0e-4744-aeed-cfae68410878; session_access_token=eyJraWQiOiJjYjNmdHNtLXNQNnNqWGd0alBTZG5HcDByUWJ1UXJJbiJ9.eyJhdWQiOiJ0aWtldC5jb20iLCJzdWIiOiI2Nzg4ZjU2NjUyMWVlZDcwNjMyYTI3ZjUiLCJuYmYiOjE3MzcwMjg5NjYsImlzcyI6Imh0dHBzOi8vd3d3LnRpa2V0LmNvbSIsImV4cCI6MTczODIzODU2Nn0.qqQHIOjlU4M9_aFY6SY8ra9IiYQe35hpSXh3bdDQ3t31rOchMCowtBfOF98rkHeo; session_refresh_token=eyJraWQiOiJ4LXRhMDZsczE3YlFGMldLak1pWlJkR2huYXBPWjVTMCJ9.eyJhdWQiOiJ0aWtldC5jb20vcnQiLCJzdWIiOiI2Nzg4ZjU2NjUyMWVlZDcwNjMyYTI3ZjUiLCJuYmYiOjE3MzcwMjg5NjYsImlzcyI6Imh0dHBzOi8vd3d3LnRpa2V0LmNvbSIsImV4cCI6MTc2ODU4ODk2Nn0.ItKzvGdHFU2dVOSDG4jW9CGy3Y0k19OPEHX99h6wx--342he2XqFmSzv3wvxvaS8; _ga=GA1.1.1106760593.1737028968; device_id=8d0a542e-7c0e-4744-aeed-cfae68410878; _gcl_au=1.1.66786922.1737028969; _fbp=fb.1.1737028970220.113514744337517498; _tt_enable_cookie=1; _ttp=d_3P0NLDN_bCIJ1iXcQzyrMrfWZ.tt.1; country_code=id; userlang=id; tiket_currency=IDR; _cfuvid=EMBPxACJrwTtzthZRJCRG451qVDV4pCHYuoLY.N8mQo-1737055996144-0.0.1.1-604800000; AMP_MKTG_b34eb5901c=JTdCJTdE; app_is_desktop=true; country_code=id; app_is_webview=false; app_logger_correlation_id=ea44df29-0c28-4d3d-9b61-5bb68ce17a51; __cf_bm=bnsvRu_kA.QOWGdrWv7nQ1vEdCzkfdJ5I_iXV3dPWbk-1737061253-1.0.1.1-tWuWGmKSuCuAekaYiaKvBp4CRMbF8ThbAru2j6lQzzRKnREoDzI5CcIJmZlFNU0IE2Tz0flR2yRbPPgUoZXDDtxia5V6sjmQCv0Et.uzc2E; cf_clearance=bnDWKYH6zQNl_CImFGj0qPD_kLqTizEBRdsK4Zm8n_w-1737061253-1.2.1.1-CVn0s3dlrkJ66.7X9xg4WUxiuAj11w1h5XeV5oWRd1V9G33O_8.JeHMz7jNDGoZWuSZml6dU3ak5HG1b9TL2niulXyhZU9Ey7AizeDTAdFsc8p2Lyd7nWcHZA4Gm66zFWiSFRaMbYh76PCexl_DCWdi4bqfoneUd.cnUnGiUVkCSf6f0aJFvG57TGbvRBCLj5lSaydXQ5Gihro1JeE7hnXJgIrGEl50mSTBcQ7POQ0CHvGiayzT2W_r7LBm2PfwxtrgmmjsTlR.O_ujdGpGl6D4oC0n03gEYEks.b4Imj7DO8dBQ0BPcgGKFmW5KkWnuLQOS9uvPIS6N3LuwDV8Q2Q; _ga_7H6ZDP2ZXG=GS1.1.1737061253.3.1.1737061340.57.0.0; AMP_b34eb5901c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI4ZDBhNTQyZS03YzBlLTQ3NDQtYWVlZC1jZmFlNjg0MTA4NzglMjIlMkMlMjJ1c2VySWQlMjIlM0ElMjIlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzM3MDYxMjUyNjY2JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTczNzA2MTM0MDkzMiUyQyUyMmxhc3RFdmVudElkJTIyJTNBMTY3JTdE',
    };

    try {
        const response = await axios.get(url, { headers });
        let res = [];
        if(response.data.code !== 'SUCCESS'){
            console.log(chalk.red(response.data.message));
            throw new Error(response.data.message);
        }
        response.data.data.departJourneys.journeys.forEach((journey) => {
            journey.segmentSchedules.forEach((train) => {
                if(train.availableSeats > 0){
                    if(train.wagonClass.detail === kelasKereta){
                        if(train.scheduleFares[0].priceAmount <= hargaMaksimun || hargaMaksimun === 0){
                            res.push({
                                id: { logname: 'ID', value: train.id },
                                trainName: { logname: 'Nama Kereta', value: train.trainName },
                                availableSeats: { logname: 'Kursi Tersedia', value: train.availableSeats },
                                trainNumber: { logname: 'Nomor Kursi', value: train.trainNumber },
                                departureStation: { logname: 'Stasiun Keberangkatan', value: `[${train.departureStation.code}] ${train.departureStation.name}` },
                                departureDate: { logname: 'Waktu keberangkatan', value: `${train.departureDate} ${train.departureTime}` },
                                arrivalStation: { logname: 'Stasiun Kedatangan', value: `[${train.arrivalStation.code}] ${train.arrivalStation.name}` },
                                arrivalDate: { logname: 'Waktu Kedatangan', value: `${train.arrivalDate} ${train.arrivalTime}` },
                                wagonClass: { logname: 'Kelas Kereta', value: `[${train.wagonClass.code}] ${train.wagonClass.detail}` },
                                subClass: { logname: 'Sub Kelas', value: train.subClass.code },
                                price: { logname: 'Harga', value: formatRupiah(train.scheduleFares[0].priceAmount) },
                            });
                        }
                        
                    }
                    
                }
                
            });
        });
        
        return res;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};


(async () => {
    const title = showMenu([
        { key: 1, value: 'Mr' },
        { key: 2, value: 'Mrs' },
        { key: 3, value: 'Ms' },
    ]);
    const fullName = readlineSync.question('[+] Masukkan nama lengkap: ');
    const phone = readlineSync.question('[+] Masukkan nomor telepon: ');
    const email = readlineSync.questionEMail('[+] Masukkan email: ');
    const nik = readlineSync.question('[+] Masukkan nomor KTP: ');
    const stasiunAsal = readlineSync.question('[+] Masukkan kode stasiun asal: ');
    const stasiunTujuan = readlineSync.question('[+] Masukkan kode stasiun tujuan: ');
    const tanggal = masukanTanggal();
    const kelasKereta = showMenu([
        { key: 1, value: 'Ekonomi' },
        { key: 2, value: 'Bisnis' },
        { key: 3, value: 'Eksekutif' },
    ]);
    const hargaMaksimun = readlineSync.questionInt('[+] Masukkan harga maksimal (input 0 jika tidak ada harga maksimal): ');
    console.log(chalk.yellow('[*] Setelah pencarian kereta didapatkan akan ada beberapa pilihan yang bisa kamu pilih berdasarkan harga:'));
    const filterHarga = showMenu([
        { key: 1, value: 'Termurah' },
        { key: 2, value: 'Tengah' },
        { key: 3, value: 'Termahal' },
    ]);

    


    let search = await searchTrain(stasiunAsal, stasiunTujuan, tanggal, kelasKereta, hargaMaksimun);

    while (search.length === 0) {
        console.log(chalk.yellow(' [' + new Date().toISOString().slice(0, 19).replace("T", " ") + '] ' + '    Tidak ada kereta yang tersedia, melakukan pencarian ulang...'));
        search = await searchTrain(stasiunAsal, stasiunTujuan, tanggal, kelasKereta, hargaMaksimun);
    }
    beautyConsole({
        tipe: 'Kereta Tersedia',
        logInfo: search,
        tipeConsole: 'cyan' 
      });
    const selectedTrain = pilihSatuKereta(search, filterHarga);
    const dataCart = {
        id: selectedTrain.id.value,
        stasiunAsal: extractCode(selectedTrain.departureStation.value),
        stasiunTujuan: extractCode(selectedTrain.arrivalStation.value),
        tanggal: formatDate(selectedTrain.departureDate.value),
        subClass: selectedTrain.subClass.value,
        trainNumber: selectedTrain.trainNumber.value,
        wagonClass: extractCode(selectedTrain.wagonClass.value)
    };
    const addCart = await addToCart(dataCart);
    if(!addCart){
        console.log(chalk.red('    Gagal menambahkan kereta ke cart'));
        return;
    }
    beautyConsole({
        tipe: 'Berhasil Menambahkan Kereta ke Cart',
        logInfo: addCart,
        tipeConsole: 'green' 
      });
      const dataPassenger = {
        cartId: addCart[0].cartId.value,
        secretId: addCart[0].secretId.value,
        title: title,
        fullName: fullName,
        phone: phone,
        email: email,
        nik: nik

      };
      const passengers = await addPassenger(dataPassenger);
        if(!passengers){
            console.log(chalk.red('    Gagal menambahkan penumpang'));
            return;
        }
      console.log(chalk.cyan('[*] Berhasil menambahkan penumpang'));
        const dataPayment = {
            cartId: addCart[0].cartId.value,
            secretId: addCart[0].secretId.value
        };
        const pay = await payment(dataPayment);
        if(!pay){
            console.log(chalk.red('    Gagal melakukan pembayaran'));
            return;
        }
        console.log(chalk.cyan('[*] Request pembayaran berhasil'));
        beautyConsole({
            tipe: 'Detail Pembayaran',
            logInfo: [{
                id: { logname: 'ID', value: pay.id },
                hash: { logname: 'Hash', value: pay.hash },
                link: { logname: 'Link Pembayaran', value: pay.link }
            }],
            tipeConsole: 'green' 
          });
          console.log(chalk.green('[*] Silahkan melakukan pembayaran sesuai dengan detail diatas'));
          console.log(chalk.green('[*] Terima kasih telah menggunakan program ini'));
        
})();