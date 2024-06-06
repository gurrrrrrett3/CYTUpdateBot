import cuid2 from "@paralleldrive/cuid2";

const id = cuid2.init({
    length: 10,
    fingerprint: "reset tomorrow"
})

export default id;
