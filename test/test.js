const curseforge = require("../index");
const assert = require("assert");

describe("getMods", function(){
    it("should return list of mods with no filtering", async function(){
        this.timeout(10000);
        
        let mods = await curseforge.getMods();
        assert.ok(mods.length > 0);
        let mod = mods.pop();
        assert.ok(mod.hasOwnProperty("id"));
        assert.ok(mod.hasOwnProperty("key"));
        assert.ok(mod.hasOwnProperty("name"));
        assert.ok(mod.hasOwnProperty("blurb"));
        assert.ok(mod.hasOwnProperty("description"));
        assert.ok(mod.hasOwnProperty("url"));
        assert.ok(mod.hasOwnProperty("owner"));
        assert.ok(mod.hasOwnProperty("categories"));
        assert.ok(mod.hasOwnProperty("logo"));
        assert.ok(mod.hasOwnProperty("downloads"));
        assert.ok(mod.hasOwnProperty("created"));
        assert.ok(mod.hasOwnProperty("updated"));
        assert.ok(mod.hasOwnProperty("visited"));
    });
    
    it("should have a complete mod object returned from getMod after finding mod using key gathered from getMods", async function(){
        this.timeout(10000);

        let mod = await curseforge.getMod((await curseforge.getMods()).pop().key);
        assert.ok(mod.hasOwnProperty("id"));
        assert.ok(mod.hasOwnProperty("key"));
        assert.ok(mod.hasOwnProperty("name"));
        assert.ok(mod.hasOwnProperty("blurb"));
        assert.ok(mod.hasOwnProperty("description"));
        assert.ok(mod.hasOwnProperty("url"));
        assert.ok(mod.hasOwnProperty("owner"));
        assert.ok(mod.hasOwnProperty("categories"));
        assert.ok(mod.hasOwnProperty("logo"));
        assert.ok(mod.hasOwnProperty("downloads"));
        assert.ok(mod.hasOwnProperty("created"));
        assert.ok(mod.hasOwnProperty("updated"));
        assert.ok(mod.hasOwnProperty("visited"));
    });

    it("should return a list of dependencies for Tinkers Construct only containing mantle", async function(){
        this.timeout(10000);
        let file = (await curseforge.getModFiles("tinkers-construct"))[0];
        let deps = await file.getDependencies();
        assert.ok(deps.length > 0);
        assert.ok(deps.pop().key === "mantle");
    });

    it("should return a list of dependencies files for Tinkers Construct only containing mantle", async function () {
        this.timeout(10000);
        let file = (await curseforge.getModFiles("tinkers-construct"))[0];
        let deps = await file.getDependenciesFiles();
        assert.ok(deps.length > 0);
        assert.ok(deps.pop().pop().mod_key === "mantle");
    });
})
