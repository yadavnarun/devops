output "dev_instance_ip" {
  value = aws_instance.actions_instance.public_ip
}