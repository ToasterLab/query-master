const query = require('./index'),
      expect = require('chai').expect

describe("query-master", () => {
  describe("accepts only valid input", () => {
    it("throws TypeError when passed null", () => {
      expect(() => query(null)).to.throw(TypeError)
    })
    it("throws TypeError when passed number", () => {
      expect(() => query(123)).to.throw(TypeError)
    })
    it("throws TypeError when passed obj", () => {
      expect(() => query({a:1})).to.throw(TypeError)
    })
    it("accepts a string", () => {
      expect(query("")).to.be.an.instanceOf(Object)
    })
  })
  describe("identifies unwanted terms", () => {
    it("a single term", () => {
      const func = query("hello -bob")
      expect(func).to.have.property('not')
      expect(func.not).to.include("bob")
    })
    it("multiple terms", () => {
      const func = query("sonic the door -wood -unobtanium -time")
      expect(func).to.have.property('not')
      expect(func.not).to.eql(["wood","unobtanium","time"])
    })
    it("terms with quotes", () => {
      const func = query('apple pear -"water-melon" -"water melon" "not this"')
      expect(func).to.have.property('not')
      expect(func.not).to.eql(["water-melon", "water melon"])
    })
  })
  describe("keeps quotes together", () => {
    it("ignores single quotes", () => {
      const func = query(`harley "holy macaroni batman" 'penguin suit'`)
      expect(func).to.have.property('must')
      expect(func.must).to.eql(['harley','holy macaroni batman', 'penguin', 'suit'])
    })
    it("keeps long quotes together", () => {
      const func = query(`the guide "time is an illusion lunchtime doubly so the guide has a few things to say on the subject of towels A towel it says is about the most massively useful thing an interstellar hitch hiker can have"`)
      expect(func).to.have.property('must')
      expect(func.must).to.eql(['the', 'guide', "time is an illusion lunchtime doubly so the guide has a few things to say on the subject of towels A towel it says is about the most massively useful thing an interstellar hitch hiker can have"])
    })
  })
  describe("ignores duplicate terms", () => {
    it("ignores dupes in must", () => {
      expect(query('buffalo buffalo buffalo buffalo buffalo buffalo donut popsicle donut').must).to.eql(
        ["buffalo","donut","popsicle"]
      )
    })
    it("ignores dupes in individual ORs", () => {
      expect(query("buffalo OR buffalo OR donut nutcase lollipop OR gingerbread OR lollipop").any).to.eql(
        [["buffalo","donut"],["lollipop","gingerbread"]]
      )
    })
    it("doesn't touch quotes", () => {
      expect(query('"buffalo buffalo buffalo buff buffalo buffalo"').must).to.eql(
        ["buffalo buffalo buffalo buff buffalo buffalo"]
      )
    })
  })
  describe("parses OR correctly", () => {
    it("handles simple OR cases", () => {
      expect(query("pooh OR tigger filler piglet OR owl filler rabbit OR eeyore").any).to.eql(
        [["pooh", "tigger"], ["piglet", "owl"], ["rabbit", "eeyore"]]
      )
    })
    it("handles multiple terms in OR chain", () => {
      expect(query("pooh OR tigger OR piglet OR rabbit OR owl filler eeyore OR christopher").any).to.eql(
        [["pooh", "tigger", "piglet", "rabbit", "owl"], ["eeyore", "christopher"]]
      )
    })
  })
})