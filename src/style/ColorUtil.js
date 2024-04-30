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


export function GetFishSkillColor(level) {
    switch (level) {
        case 1:
            return 'gray.500';
        case 2:
            return 'green.500';
        case 3:
            return 'blue.500';
        case 4:
            return 'purple.500';
        case 5:
            return 'orange.500';
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