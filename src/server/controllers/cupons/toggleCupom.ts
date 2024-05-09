import { Request, Response } from "express";
import { CuponsModel } from "../../db/models/Cupons";

export const toggleCupom = async(req : Request,res : Response)=>{
    const  {id}  = req.params 

    if (!id) {
      return res.status(402).json({
        error: 'o id do cupom deve ser informado'
      })
    }

    try {
    const cupom = await CuponsModel.findById(id);

    if (!cupom) {
      return res.status(404).json({
        erro: 'nenhum cupom com esse id foi encontrado'
      })
    }

    const cupomDate = await CuponsModel.findByIdAndUpdate(id, {
      $set: {active: !cupom?.active}
    })

      return res.status(200).json({
        message: 'cupom atualizado com sucesso', cupomDate
      })
    } catch (error) {
      console.log(error)
  return res.status(404).json({
    message: "erro no no cupom create", error
})
    }

}