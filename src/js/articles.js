// 点赞
$('.addlike').addEventListener('click', function(){
  let src = this.src.split('images/')[1]
  let src1 = this.dataset.src1.split('images/')[1]
  let src2 = this.dataset.src2.split('images/')[1]
  console.log(src,src1,src2)
  if (src === src1) {
    this.src = this.dataset.src2
    // 人数加一
  } else {
    this.src = this.dataset.src1
    // 人数减一
  }
})