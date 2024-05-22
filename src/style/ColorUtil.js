export function GetFishStatusColor(status) {
    switch (status) {
        case 0:
            return 'green.300';
        case 1:
            return 'blue.300';
        case 3:
            return 'gray.300';
        case 2:
            return 'yellow.300';
        default:
            return '';
    }
}

export function GetFishColorByRating(rating) {
    if (rating < 2000) {
        return 'teal.300';
    } else if (rating < 4000) {
        return 'blue.300';
    } else if (rating < 6000) {
        return 'purple.300';
    } else if (rating < 8000) {
        return 'yellow.300';
    } else if (rating <= 10000) {
        return 'orange.300';
    }
}



export function GetFishColorByRatingMobile(rating) {
    if (rating < 2000) {
        return 'teal';
    } else if (rating < 4000) {
        return 'blue';
    } else if (rating < 6000) {
        return 'purple';
    } else if (rating < 8000) {
        return 'yellow';
    } else {
        return 'orange';
    }
}


export function GetFishSkillColor(level) {
    switch (level) {
        case 1:
            return 'gray.500';
        case 2:
            return 'green.400';
        case 3:
            return 'blue.400';
        case 4:
            return 'purple.600';
        case 5:
            return 'orange.600';
        default:
            return '';
    }
}

export function GetParkingStatusColor(status) {
    switch (status) {
        case 0:
            return 'gray.400';
        case 1:
            return 'gray.300';
        default:
            return '';
    }
}

export function GetParkingStatusColorMobile(status) {
    switch (status) {
        case 0:
            return 'teal';
        case 1:
            return 'gray';
        default:
            return '';
    }
}

export function GetHpProgressColor(heal, maxHeal) {
    if (heal < 0) {
        heal = 0;
    }
    if (heal / maxHeal > 0.7) {
        return 'whatsapp';
    }
    if (heal / maxHeal > 0.4) {
        return 'yellow';
    }
    if (heal / maxHeal > 0.2) {
        return 'orange';
    }
    return 'red';
}