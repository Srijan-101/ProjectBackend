const { PrismaClient } = require("@prisma/client");
const { orderItem, customerTable, outlet } = new PrismaClient();


//AddOrderItem
exports.AddOrderItem = async (req, res) => {
    const TableId = req.body.TableId;
    try {
        const table = await customerTable.update({
            data: {
                OrderItem: {
                    create: {
                        Name: req.body.name,
                        Category: req.body.category,
                        Qty: parseInt(req.body.qty),
                        price: parseInt(req.body.price),
                    }
                }
            },
            where: {
                id: TableId
            }
        })
        if (table) {
            return res.status(200).json({ error: "Sucessful" });
        } else {
            return res.status(400).json({ error: "Server error.Please try again later." });
        }
    } catch (e) {
        console.log(e);
        return res
            .status(400)
            .json({ error: "Server error.Please try again later." });
    }
}

//getOrderItem 
exports.GetOrderItem = async (req, res) => {
    const TableId = req.params.id;

    try {
        const table = await customerTable.findFirst({
            select: {
                OrderItem: true
            },
            where: {
                id: TableId
            }
        })

        if (table) {
            return res.status(200).json(table);
        } else {
            return res
                .status(400)
                .json({ error: "Server error.Please try again later." });
        }
    } catch (e) {
        return res
            .status(400)
            .json({ error: "Server error.Please try again later." });
    }
}

//deleteOrderItem 
exports.deleteItem = async (req, res) => {
    const ItemID = req.body.id;
    try {
        const deleted = await orderItem.delete({
            where: {
                id: ItemID
            }
        })
        if (deleted) { return res.status(200).json({ message: "Sucessful" }) }
        else {
            return res
                .status(400)
                .json({ error: "Server error.Please try again later." });
        }
    } catch (e) {
        return res
            .status(400)
            .json({ error: "Server error.Please try again later." });
    }
}