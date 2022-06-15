resource "aws_vpc" "actions_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    "name" = "actions-dev"
  }
}

resource "aws_subnet" "actions_subnet" {
  vpc_id                  = aws_vpc.actions_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "ap-south-1a"

  tags = {
    "name" = "actions-dev-public"
  }
}

resource "aws_internet_gateway" "actions_igw" {
  vpc_id = aws_vpc.actions_vpc.id

  tags = {
    "name" = "actions-dev-igw"
  }
}

resource "aws_route_table" "actions_public_rt" {
  vpc_id = aws_vpc.actions_vpc.id

  tags = {
    "name" = "actions-dev-public-rt"
  }
}

resource "aws_route" "actions_public_rt_default" {
  route_table_id         = aws_route_table.actions_public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.actions_igw.id
}

resource "aws_route_table_association" "actions_public_rt_assoc" {
  subnet_id      = aws_subnet.actions_subnet.id
  route_table_id = aws_route_table.actions_public_rt.id
}

resource "aws_security_group" "actions_sg" {
  name        = "actions-dev-sg"
  description = "Security group for actions-dev"
  vpc_id      = aws_vpc.actions_vpc.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"] # change to your ip range
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "actions_key_pair" {
  key_name   = "actions-dev-key-pair"
  public_key = file("~/.ssh/actions.pub")
}

resource "aws_instance" "actions_instance" {
  instance_type          = "t2.micro"
  ami                    = data.aws_ami.server_ami.id
  key_name               = aws_key_pair.actions_key_pair.id
  vpc_security_group_ids = [aws_security_group.actions_sg.id]
  subnet_id              = aws_subnet.actions_subnet.id
  user_data              = file("userdata.tpl")

  # root_block_device {
  #   volume_size = 5
  # }

  tags = {
    "name" = "actions-node"
  }

  # this provisioner works for linux/osx, but not for windows  
  provisioner "local-exec" {
    command = templatefile("ssh-config.tpl", {
      hostname     = self.public_ip,
      user         = "ubuntu",
      identityfile = "~/.ssh/actions",
    })
    interpreter = ["bash", "-c"]
  }
}
