class SuperVisor {

    nameTask() {
        return 'SUPERVISOR';
    }

    isDuplicate(data) {

    }

    isInconsistent(data) {

    }

    isMissing(data) {

    }

    isNoisy(data) {

    }

    checkErrorData(data) {
        let noisy = this.isNoisy(data);
        let missing = this.isMissing(data);
        let consistent = this.isInconsistent(data);
        let duplicate = this.isDuplicate(data);
    }

    raiseErrorFlag() {
        this.status = true;
    }

    saveData() {

    }


}