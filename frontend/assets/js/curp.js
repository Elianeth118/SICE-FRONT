//--- Author: Ambrosio Cardoso Jimenez
//--- cardosojmz@gmail.com
const  generateCURP = (name, firstSurname, secondSurname, dateOfBirth, genre, state, differentiator) => {
    let curp = '';

    const wordToRemoves = /( DE LA | DE LOS | DE LO | DAS | DA | DEL | DER | DIE | DI | DD | DE | LAS | LES | LE | LOS | LO | LA | MAC | MC | VAN | VON | Y )+/;
    const commonNames = /^(MARIA |JOSE |MA. |MA |J. |J )/;

    name = normalyze(name.toUpperCase().replace(/Ñ/g, 'X').trim());
    firstSurname = normalyze(firstSurname.toUpperCase().replace(/Ñ/g, 'X').trim());
    secondSurname = normalyze(secondSurname.toUpperCase().replace(/Ñ/g, 'X').trim());
    genre = genre.toUpperCase().trim();

    if (dateOfBirth.trim().length !== 10) return '';

    name = name.replace(commonNames, ''); // Remove common names
    name = ' ' + name.trim();
    secondSurname = ' ' + secondSurname.trim();
    firstSurname = ' ' + firstSurname.trim();

    name = name.replace(wordToRemoves, '');
    firstSurname = firstSurname.replace(wordToRemoves, '');
    secondSurname = secondSurname.replace(wordToRemoves, '');

    name = name.trim() + ' ';
    secondSurname = secondSurname.trim();
    firstSurname = firstSurname.trim();
    name = name.substring(0, name.indexOf(' ')).trim();

    if (firstSurname === '') { firstSurname = secondSurname; secondSurname = 'X'; }
    if (secondSurname.trim() === '') secondSurname = 'X';

    curp = firstSurname.substring(0, 1) +
        findVowel(firstSurname) +
        secondSurname.substring(0, 1) +
        name.substring(0, 1);

    curp = changeRudeness(curp);
    curp += dateOfBirth.substring(8) + dateOfBirth.substring(3, 5) + dateOfBirth.substring(0, 2);
    curp += genre; //(genre === 'F' || genre === 'FEMENINO'  || genre === 'M') ? 'M' : 'H';
    curp += getCodeState(state);
    curp += findConsonant(firstSurname) +
        findConsonant(secondSurname) +
        findConsonant(name);

    const alfa = 'ABCDEFGHIJ';
    const digits = '0123456789';
    const epoch = dateOfBirth.substring(6, 8);
    if ((epoch === '19' && digits.indexOf(differentiator) >= 0) ||
        (epoch === '20' && alfa.indexOf(differentiator) >= 0)
    ) {
        curp += differentiator;
    } else curp += 'X';

    const dv = verifierDigit(curp);
    curp += dv.toString();
    

    return curp;
}

const findVowel = (str) => {
    const vowels = 'AEIOU';
    for (let i = 1; i < str.length; i++) {
        if (vowels.indexOf(str.charAt(i)) >= 0) {
            return str.charAt(i);
        } else if ("/-.".indexOf(str.charAt(i)) >= 0) {
            return 'X';
        }
    }
    return 'X';
}

const findConsonant = (str) => {
    str = str.trim().substring(1).replace(/[\/\-.AEIOU]/g, '').trim();
    return (str.length > 0 ? str.substring(0, 1) : 'X');
}

const changeRudeness = (str) => {
    const obscenes = /(BACA|BAKA|BUEI|BUEY|CACA|CACO|CAGA|CAGO|CAKA|CAKO|COGE|COGI|COJA|COJE|COJI|COJO|COLA|CULO|FALO|FETO|GETA|GUEI|GUEY|JETA|JOTO|KACA|KACO|KAGA|KAGO|KAKA|KAKO|KOGE|KOGI|KOJA|KOJE|KOJI|KOJO|KOLA|KULO|LILO|LOCA|LOCO|LOKA|LOKO|MAME|MAMO|MEAR|MEAS|MEON|MIAR|MION|MOCO|MOKO|MULA|MULO|NACA|NACO|PEDA|PEDO|PENE|PIPI|PITO|POPO|PUTA|PUTO|QULO|RATA|ROBA|ROBE|ROBO|RUIN|SENO|TETA|VACA|VAGO|VAKA|VUEI|VUEY|WUEI|WUEY|VAGA)/;
    const strSlice = str.substring(0, 4);
    const isFound = obscenes.test(strSlice);

    if (isFound)
        str = str.substring(0, 1) + 'X' + str.substring(2);

    return str;
}

const getCodeState = (state) => {
    const states = {
        "AS": "Aguascalientes",
        "BC": "Baja California",
        "BS": "Baja California Sur",
        "CC": "Campeche",
        "CS": "Chiapas",
        "CH": "Chihuahua",
        "CL": "Coahuila",
        "CM": "Colima",
        "DF": "Distrito Federal",
        "DG": "Durango",
        "GT": "Guanajuato",
        "GR": "Guerrero",
        "HG": "Hidalgo",
        "JC": "Jalisco",
        "MC": "México",
        "MN": "Michoacan",
        "MS": "Morelos",
        "NT": "Nayarit",
        "NL": "Nuevo León",
        "OC": "Oaxaca",
        "PL": "Puebla",
        "QT": "Querétaro",
        "QR": "Quintana Roo",
        "SP": "San Luis Potosí",
        "SL": "Sinaloa",
        "SR": "Sonora",
        "TC": "Tabasco",
        "TL": "Tlaxcala",
        "TS": "Tamaulipas",
        "VZ": "Veracruz",
        "YN": "Yucatán",
        "ZS": "Zacatecas",
        "NE": "Nacido en el Extranjero"
    };

    state = state.trim().toUpperCase();
    if (state.length === 2) {
        if (!states.hasOwnProperty(state)) {
            return "";
        } else return state;
    } else {
        for (const [key, value] of Object.entries(states)) {
            if (value.toUpperCase() === state) {
                return key;
            }
        }
    }

    return "";
}

const transformCodeChar = (codeChar) => {
    if (codeChar >= 48 && codeChar <= 57) return (codeChar - 48);
    else if (codeChar >= 65 && codeChar <= 78) return (codeChar - 55);
    else if (codeChar >= 79 && codeChar <= 90) return (codeChar - 54);
    else return 0;
}

const verifierDigit = (curp) => {
    let dv = 0;
    for (let i = 0; i < curp.length; i++) {
        const codeChar = curp.charCodeAt(i);
        const c = transformCodeChar(codeChar);
        dv += c * (18 - i);
    }
    dv %= 10;
    return (dv === 0 ? 0 : 10 - dv);
}

const normalyze = (str) => {
    const original = "ÃÀÄÂÁÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛÇãàäâáèéëêìíïîòóöôùúüûçÑñ";
    const replacement = "AAAAAEEEEIIIIOOOOUUUUCaaaaaeeeeiiiioooouuuucNn";
    if (str === null) { return null; }
    let array = str.split('');
    for (let i = 0; i < array.length; i++) {
        const pos = original.indexOf(array[i]);
        if (pos > -1) {
            array[i] = replacement.charAt(pos);
        }
    }
    return array.join('');
}

// Example usage:
//--- const curpGenerated = generateCURP("Axel", "Calvo", "Cruz", "20/10/2000", "H", "OC", "A");
//--- console.log(curpGenerated);
