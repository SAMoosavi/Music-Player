import {writeFile, readFileSync, existsSync} from 'node:fs'

class WorkFile {
    private readonly fileName: string;

    constructor(fileName: string) {
        this.fileName = './src/data/' + fileName + '.json'
    }

    public read() {
        if (!existsSync(this.fileName))
            return null
        const txt = readFileSync(this.fileName, 'utf-8')
        if (txt)
            return JSON.parse(txt)
        else return null
    }

    public write(data: any) {
        let txt = JSON.stringify(data)
        writeFile(this.fileName, txt, (err) => {
            if (err) throw err
        })
    }
}

export default WorkFile