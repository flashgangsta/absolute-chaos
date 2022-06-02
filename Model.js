export class Model {
    #data;
    #minChars;
    #maxChars;
    #message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Saepe ab Aristotele, a Theophrasto mirabiliter est laudata per se ipsa rerum scientia; Me igitur ipsum ames oportet, non mea, si veri amici futuri sumus. Claudii libidini, qui tum erat summo ne imperio, dederetur. At vero illa perfecta atque plena eorum, qui cum de hominis summo bono quaererent, nullam in eo neque animi neque corporis partem vacuam tutela reliquerunt. Nec enim, omnes avaritias si aeque avaritias esse dixerimus, sequetur ut etiam aequas esse dicamus. Duo Reges: constructio interrete. Post enim Chrysippum eum non sane est disputatum. Cuius similitudine perspecta in formarum specie ac dignitate transitum est ad honestatem dictorum atque factorum. Aderamus nos quidem adolescentes, sed multi amplissimi viri, quorum nemo censuit plus Fadiae dandum, quam posset ad eam lege Voconia pervenire. Ita multo sanguine profuso in laetitia et in victoria est mortuus. Hoc est vim afferre, Torquate, sensibus, extorquere ex animis cognitiones verborum, quibus inbuti sumus. Est tamen ea secundum naturam multoque nos ad se expetendam magis hortatur quam superiora omnia. Intellegi quidem, ut propter aliam quampiam rem, verbi gratia propter voluptatem, nos amemus; Iam illud quale tandem est, bona praeterita non effluere sapienti, mala meminisse non oportere? Quis animo aequo videt eum, quem inpure ac flagitiose putet vivere? Rapior illuc, revocat autem Antiochus, nec est praeterea, quem audiamus.";


    constructor() {
        this.#data = [];
        this.#minChars = 10;
        //this.#maxChars = this.#message.length - this.#minChars;
        this.#maxChars = 250;
        const len = 400;
        for(let i = 0; i < len; i++) {
            this.#data.push(this.#getTextPart());
        }
    }

    #getTextPart() {
        const from = Math.floor(Math.random() * this.#maxChars);
        const length = this.#minChars + (Math.floor(Math.random() * this.#maxChars - from));
        let result = this.#message.substring(from, length).trim();
        if([".", ",", ";", "?", "!"].includes(result.charAt(0))) {
            result = result.substring(1, result.length).trim();
        }
        result = result.charAt(0).toUpperCase() + result.substring(1, result.length);
        return result;
    }

    getMessageAt(index) {
        return this.#data[index];
    }

    getMessagesTotal() {
        return this.#data.length;
    }
}